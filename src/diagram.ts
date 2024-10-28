import "./hack_cola";

import * as d3 from "d3";

import { WebColaConstraint } from "../types/WebCola";
import { Bundle } from "./bundle";
import { Group, GroupOptions } from "./group";
import { Link, LinkDataType } from "./link";
import { LinkTooltip } from "./link_tooltip";
import { Node, NodeDataType, NodeOptions } from "./node";
import { NodeTooltip } from "./node_tooltip";
import { NodePosition, PositionCache } from "./position_cache";

const cola = require("cola"); // eslint-disable-line @typescript-eslint/no-require-imports

type LinkWidthFunction = (object) => number;
export type HrefFunction = (object, type?: "node" | "link") => string;
export type InetHengeDataType = { nodes: NodeDataType[]; links: LinkDataType[] };
// Fix @types/d3/index.d.ts. Should be "d3.scale.Ordinal<number, string>" but "d3.scale.Ordinal<string, string>" somehow
export type Color = d3.scale.Ordinal<string, string>;
type PositionHint = {
  nodeCallback?: (node: Node) => NodePosition;
};
type PositionConstraint = {
  axis: "x" | "y";
  nodesCallback: (nodes: Node[]) => Node[][];
};
type DiagramOptionType = {
  // Options publicly available
  width: number;
  height: number;
  nodeWidth: number;
  nodeHeight: number;
  groupPadding: number;
  initialTicks: number;
  ticks: number;
  positionCache: boolean | string;
  positionHint: PositionHint;
  positionConstraints: PositionConstraint[];
  bundle: boolean;
  pop: RegExp;
  distance: LinkWidthFunction;
  tooltip: string;
  href: HrefFunction;

  // Internal options
  selector: string;
  urlOrData: string | InetHengeDataType;
  groupPattern: RegExp | undefined;
  color: Color;
  maxTicks: number;

  meta: string[];
};

class DiagramBase {
  public tickCallback: () => void;

  private options: DiagramOptionType;
  private readonly setDistance: (object) => number;
  private getLinkWidth: LinkWidthFunction;
  private zoom: d3.behavior.Zoom<unknown>;
  private cola;
  private uniqueUrl: string;
  private positionCache: PositionCache;
  private indicator: d3.Selection<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  private initialTranslate: [number, number];
  private initialScale: number;
  private svg: d3.Selection<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(container: string, urlOrData: string | InetHengeDataType, options: DiagramOptionType) {
    options ||= {} as DiagramOptionType;
    this.options = Object.assign({}, options);
    this.options.selector = container;
    this.options.urlOrData = urlOrData;
    this.options.groupPattern = options.pop;
    this.options.width = options.width || 960;
    this.options.height = options.height || 600;
    this.options.positionHint = options.positionHint || {};
    this.options.positionConstraints = options.positionConstraints || [];

    this.options.color = d3.scale.category20();
    this.options.initialTicks = options.initialTicks || 0;
    this.options.maxTicks = options.ticks || 1000;
    // NOTE: true or 'fixed' (experimental) affects behavior
    this.options.positionCache = "positionCache" in options ? options.positionCache : true;
    // NOTE: This is an experimental option
    this.options.bundle = "bundle" in options ? options.bundle : false;
    this.options.tooltip = options.tooltip;

    this.setDistance = this.linkDistance(options.distance || 150);
    NodeTooltip.setHref(options.href);
    LinkTooltip.setHref(options.href);
  }

  init(...meta: string[]) {
    this.options.meta = meta;
    this.cola = this.initCola();
    this.svg = this.initSvg();

    this.displayLoadMessage();

    if (typeof this.options.urlOrData === "object") {
      setTimeout(() => {
        // Run asynchronously
        this.render(this.options.urlOrData as InetHengeDataType);
      });
    } else {
      d3.json(this.url(), (error, data) => {
        if (error) {
          console.error(error);
          this.showMessage(`Failed to load "${this.url()}"`);
        }

        this.render(data);
      });
    }
  }

  initCola() {
    return cola
      .d3adaptor()
      .avoidOverlaps(true)
      .handleDisconnected(false)
      .size([this.options.width, this.options.height]);
  }

  initSvg() {
    this.zoom = d3.behavior.zoom();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const container: d3.Selection<any> = d3
      .select(this.options.selector)
      .append("svg")
      .attr("width", this.options.width)
      .attr("height", this.options.height)
      .append("g")
      .call(this.zoom.on("zoom", () => this.zoomCallback(container)))
      .append("g");

    container
      .append("rect")
      .attr("width", this.options.width * 10) // 10 is huge enough
      .attr("height", this.options.height * 10)
      .attr("transform", `translate(-${this.options.width * 5}, -${this.options.height * 5})`)
      .style("opacity", 0);

    return container;
  }

  render(data: InetHengeDataType) {
    try {
      const nodes = data.nodes
        ? data.nodes.map(
            (n, i) =>
              new Node(n, i, {
                width: this.options.nodeWidth,
                height: this.options.nodeHeight,
                metaKeys: this.options.meta,
                color: this.options.color,
                tooltip: !!this.options.tooltip,
              } as NodeOptions),
          )
        : [];
      const links = data.links
        ? Bundle.sortByBundle(data.links).map(
            (l, i) =>
              new Link(l, i, {
                metaKeys: this.options.meta,
                linkWidth: this.getLinkWidth,
              }),
          )
        : [];
      const groups = Group.divide(nodes, this.options.groupPattern, {
        color: this.options.color,
        padding: this.options.groupPadding,
      } as GroupOptions);
      const nodeTooltips = nodes.map((n) => new NodeTooltip(n, this.options.tooltip));
      const linkTooltips = links.map((l) => new LinkTooltip(l, this.options.tooltip));
      const bundles = Bundle.divide(links);

      this.cola.nodes(nodes).links(links).groups(groups);
      this.applyConstraints(this.options.positionConstraints, nodes);
      this.setDistance(this.cola);

      // Start to update Link.source and Link.target with Node object after
      // initial layout iterations without any constraints.
      this.cola.start(this.options.initialTicks);

      const groupLayer = this.svg.append("g").attr("id", "groups");
      const linkLayer = this.svg.append("g").attr("id", "links");
      const nodeLayer = this.svg.append("g").attr("id", "nodes");
      const linkLabelLayer = this.svg.append("g").attr("id", "link-labels");
      const tooltipLayer = this.svg.append("g").attr("id", "tooltips");

      const [link, path, label] = Link.render(linkLayer, linkLabelLayer, links);
      const bundle = Bundle.render(linkLayer, bundles);

      const group = Group.render(groupLayer, groups).call(
        this.cola
          .drag()
          .on("dragstart", DiagramBase.dragstartCallback)
          .on("drag", () => {
            if (this.options.bundle) {
              Link.shiftBundle(link, path, label, bundle);
            }

            NodeTooltip.followObject(nodeTooltip);
            LinkTooltip.followObject(linkTooltip);
          }),
      );

      const node = Node.render(nodeLayer, nodes).call(
        this.cola
          .drag()
          .on("dragstart", DiagramBase.dragstartCallback)
          .on("drag", () => {
            if (this.options.bundle) {
              Link.shiftBundle(link, path, label, bundle);
            }

            NodeTooltip.followObject(nodeTooltip);
            LinkTooltip.followObject(linkTooltip);
          }),
      );

      // without path calculation
      this.configureTick(group, node, link);

      this.positionCache = PositionCache.load(data, this.options.groupPattern);
      if (this.options.positionCache && this.positionCache) {
        // NOTE: Evaluate only when positionCache: true or 'fixed', and
        //       when the stored position cache matches a pair of given data and pop
        Group.setPosition(group, this.positionCache.group);
        Node.setPosition(node, this.positionCache.node);
        Link.setPosition(link, this.positionCache.link);
      } else {
        if (this.options.positionHint.nodeCallback) {
          Node.setPosition(
            node,
            node.data().map((d) => this.options.positionHint.nodeCallback(d)),
          );
          this.cola.start(); // update internal positions of objects before ticks forward
        }

        this.ticksForward();
        this.positionCache = new PositionCache(data, this.options.groupPattern);
        this.savePosition(group, node, link);
      }

      this.hideLoadMessage();

      this.configureTick(group, node, link, path, label); // render path
      this.removeConstraints();

      this.cola.start();
      if (this.options.bundle) {
        Link.shiftBundle(link, path, label, bundle);
      }

      path.attr("d", (d) => d.d()); // make sure path calculation is done
      DiagramBase.freeze(node);

      const nodeTooltip = NodeTooltip.render<NodeTooltip>(tooltipLayer, nodeTooltips);
      const linkTooltip = LinkTooltip.render<LinkTooltip>(tooltipLayer, linkTooltips);

      // NOTE: This is an experimental option
      if (this.options.positionCache === "fixed") {
        this.cola.on("end", () => {
          this.savePosition(group, node, link);
        });
      }
    } catch (e) {
      this.showMessage(e);
      throw e;
    }
  }

  linkWidth(func: LinkWidthFunction) {
    this.getLinkWidth = func;
  }

  attr(name: string, value: string) {
    if (!this.initialTranslate) {
      this.saveInitialTranslate();
    }

    this.svg.attr(name, value);

    const transform = d3.transform(this.svg.attr("transform")); // FIXME: This is valid only for d3.js v3
    this.zoom.scale(transform.scale[0]); // NOTE: Assuming ky = kx
    this.zoom.translate(transform.translate);
  }

  destroy() {
    d3.select("body svg").remove();
    Node.reset();
    Link.reset();
    Bundle.reset();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static freeze(container: d3.Selection<any>) {
    container.each((d) => (d.fixed = true));
  }

  private static dragstartCallback() {
    (d3.event as d3.ZoomEvent).sourceEvent.stopPropagation();
  }

  private linkDistance(distance: number | ((any) => number)) {
    if (typeof distance === "function") return distance;
    else return (cola) => cola.linkDistance(distance);
  }

  private url() {
    if (this.uniqueUrl) {
      return this.uniqueUrl;
    }

    this.uniqueUrl = `${this.options.urlOrData}?${new Date().getTime()}`;
    return this.uniqueUrl;
  }

  private configureTick(
    group: d3.Selection<Group>,
    node: d3.Selection<Node>,
    link: d3.Selection<Link>,
    path?: d3.Selection<Link>,
    label?: d3.Selection<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    // this.cola.on() overrides existing listener, not additionally register it.
    // May need to call it manually.
    this.tickCallback = () => {
      Node.tick(node);
      Link.tick(link, path, label);
      Group.tick(group);
    };

    this.cola.on("tick", this.tickCallback);
  }

  private ticksForward(count?: number) {
    count = count || this.options.maxTicks;

    for (let i = 0; i < count; i++) this.cola.tick();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private zoomCallback(container: d3.Selection<any>) {
    if (!this.initialTranslate) {
      this.saveInitialTranslate();
    }

    const event = d3.event as d3.ZoomEvent;

    event.scale *= this.initialScale;
    event.translate[0] += this.initialTranslate[0];
    event.translate[1] += this.initialTranslate[1];

    Link.zoom(event.scale);
    container.attr("transform", `translate(${event.translate}) scale(${event.scale})`);
  }

  private displayLoadMessage() {
    this.indicator = this.svg
      .append("text")
      .attr("x", this.options.width / 2)
      .attr("y", this.options.height / 2)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text("Simulating. Just a moment ...");
  }

  private hideLoadMessage() {
    if (this.indicator) this.indicator.remove();
  }

  private showMessage(message: string) {
    if (this.indicator) this.indicator.text(message);
  }

  private saveInitialTranslate() {
    const transform = d3.transform(this.svg.attr("transform")); // FIXME: This is valid only for d3.js v3
    this.initialScale = transform.scale[0]; // NOTE: Assuming ky = kx
    this.initialTranslate = transform.translate;
  }

  private savePosition(group: d3.Selection<Group>, node: d3.Selection<Node>, link: d3.Selection<Link>) {
    this.positionCache.save(group, node, link);
  }

  private applyConstraints(constraints: PositionConstraint[], nodes: Node[]) {
    const colaConstraints: WebColaConstraint[] = [];

    for (const constraint of constraints) {
      for (const ns of constraint.nodesCallback(nodes)) {
        colaConstraints.push({
          type: "alignment",
          axis: constraint.axis,
          offsets: ns.map((n) => ({ node: n.id, offset: 0 })),
        });
      }
    }

    this.cola.constraints(colaConstraints);
  }

  private removeConstraints() {
    this.cola.constraints([]);
  }
}

const Pluggable = (Base: typeof DiagramBase) => {
  class Diagram extends Base {
    static plugin(cls, options = {}) {
      cls.load(Group, Node, Link, options);
    }
  }

  return Diagram;
};

const Eventable = (Base: typeof DiagramBase) => {
  class Diagram extends Base {
    private dispatch: d3.Dispatch;

    constructor(container: string, urlOrData: string | InetHengeDataType, options: DiagramOptionType) {
      super(container, urlOrData, options);

      this.dispatch = d3.dispatch("rendered");
    }

    render(arg) {
      super.render(arg);
      this.dispatch.rendered();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(name: string, callback: () => any) {
      this.dispatch.on(name, callback);
    }
  }

  return Diagram;
};

class PluggableDiagram extends Pluggable(DiagramBase) {}

export class Diagram extends Eventable(PluggableDiagram) {}
