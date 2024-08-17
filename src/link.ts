import * as d3 from "d3";

import { Bundle } from "./bundle";
import { MetaData, MetaDataType } from "./meta_data";
import { Node } from "./node";
import { LinkPosition } from "./position_cache";
import { classify } from "./util";

export type Constructor = (data: LinkDataType, id: number, metaKeys: string[], linkWidth: (object) => number) => void;

export type LinkDataType = {
  source: string;
  target: string;
  bundle?: number | string;
  meta: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  class: string;
};

export type LinkOptions = {
  metaKeys: string[];
  linkWidth: (object) => number;
};

export class LinkBase {
  private static groups: Record<string, number[]>;

  public readonly bundle?: number | string;
  public readonly source: number | Node;
  public readonly target: number | Node;
  public readonly metaList: MetaDataType[];
  public readonly sourceMeta: MetaDataType[];
  public readonly targetMeta: MetaDataType[];

  private readonly extraClass: string;
  private width: number;
  private readonly defaultMargin: number;
  private readonly labelXOffset: number;
  private readonly labelYOffset: number;
  private color: string;
  private _margin: number;
  private _shiftMultiplier: number;

  constructor(data: LinkDataType, public id: number, private options: LinkOptions) {
    this.source = Node.idByName(data.source);
    this.target = Node.idByName(data.target);
    this.bundle = data.bundle;
    this.metaList = new MetaData(data.meta).get(options.metaKeys);
    this.sourceMeta = new MetaData(data.meta, "source").get(options.metaKeys);
    this.targetMeta = new MetaData(data.meta, "target").get(options.metaKeys);
    this.extraClass = data.class || "";

    if (typeof options.linkWidth === "function") this.width = options.linkWidth(data.meta) || 3;
    else this.width = options.linkWidth || 3;

    this.defaultMargin = 15;
    this.labelXOffset = 20;
    this.labelYOffset = 1.5; // em
    this.color = "#7a4e4e";

    this.register(id);
  }

  private register(id: number) {
    Link.groups = Link.groups || {};

    // source and target
    const key = [this.source, this.target].sort().toString();
    (Link.groups[key] || (Link.groups[key] = [])).push(id);
  }

  private isLabelledPath() {
    return this.metaList.length > 0;
  }

  private isReversePath() {
    return this.targetMeta.length > 0;
  }

  d() {
    return `M ${(this.source as Node).x} ${(this.source as Node).y} L ${(this.target as Node).x} ${
      (this.target as Node).y
    }`;
  }

  private pathId() {
    return `path${this.id}`;
  }

  public linkId() {
    return `link${this.id}`;
  }

  private margin() {
    if (!this._margin) {
      const margin = window.getComputedStyle(document.getElementById(this.linkId())).margin;

      // NOTE: Assuming that window.getComputedStyle() returns some value link "10px"
      // or "0px" even when not defined in .css
      if (!margin || margin === "0px") {
        this._margin = this.defaultMargin;
      } else {
        this._margin = parseInt(margin);
      }
    }

    return this._margin;
  }

  group(): number[] {
    return Link.groups[[(this.source as Node).id, (this.target as Node).id].sort().toString()];
  }

  // OPTIMIZE: Implement better right-alignment of the path, especially for multi tspans
  private tspanXOffset() {
    switch (true) {
      case this.isLabelledPath():
        return 0;
      case this.isReversePath():
        return -this.labelXOffset;
      default:
        return this.labelXOffset;
    }
  }

  private tspanYOffset() {
    if (this.isLabelledPath()) return `${-this.labelYOffset + 0.7}em`;
    else return `${this.labelYOffset}em`;
  }

  private rotate(bbox: SVGRect) {
    if ((this.source as Node).x > (this.target as Node).x)
      return `rotate(180 ${bbox.x + bbox.width / 2} ${bbox.y + bbox.height / 2})`;
    else return "rotate(0)";
  }

  private split() {
    if (!this.metaList && !this.sourceMeta && !this.targetMeta) return [this];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta: Record<string, any>[] = [];
    ["metaList", "sourceMeta", "targetMeta"].forEach((key, i, keys) => {
      if (this[key]) {
        const duped = Object.assign(Object.create(this), this);

        keys.filter((k) => k !== key).forEach((k) => (duped[k] = []));
        meta.push(duped);
      }
    });

    return meta;
  }

  private hasMeta() {
    return this.metaList.length > 0 || this.sourceMeta.length > 0 || this.targetMeta.length > 0;
  }

  class() {
    // eslint-disable-next-line max-len
    return `link ${classify((this.source as Node).name)} ${classify((this.target as Node).name)} ${classify(
      (this.source as Node).name,
    )}-${classify((this.target as Node).name)} ${this.extraClass}`;
  }

  // after transform is applied
  centerCoordinates() {
    const link = d3.select(`.link #${this.linkId()}`).node() as SVGLineElement;
    const bbox = link.getBBox();
    const transform = link.transform.baseVal.consolidate();

    return [
      bbox.x + bbox.width / 2 + (transform?.matrix.e || 0),
      bbox.y + bbox.height / 2 + (transform?.matrix.f || 0),
    ];
  }

  angle() {
    const link = d3.select(`.link #${this.linkId()}`).node() as SVGLineElement;
    return (
      (Math.atan2(link.y2.baseVal.value - link.y1.baseVal.value, link.x2.baseVal.value - link.x1.baseVal.value) * 180) /
      Math.PI
    );
  }

  static render(
    linkLayer: d3.Selection<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    labelLayer: d3.Selection<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    links: Link[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): [d3.Selection<Link>, d3.Selection<Link>, d3.Selection<any>] {
    // Render lines
    const pathGroup = linkLayer
      .selectAll(".link")
      .data(links)
      .enter()
      .append("g")
      .attr("class", (d) => d.class());

    const link = pathGroup
      .append("line")
      .attr("x1", (d) => (d.source as Node).x)
      .attr("y1", (d) => (d.source as Node).y)
      .attr("x2", (d) => (d.target as Node).x)
      .attr("y2", (d) => (d.target as Node).y)
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", (d) => d.width)
      .attr("id", (d) => d.linkId())
      .on("mouseover.line", (d) => textGroup.selectAll(`text.${d.pathId()}`).classed("hover", true))
      .on("mouseout.line", (d) => textGroup.selectAll(`text.${d.pathId()}`).classed("hover", false));

    const path = pathGroup
      .append("path")
      .attr("d", (d) => d.d())
      .attr("id", (d) => d.pathId());

    // Render texts
    const textGroup = labelLayer
      .selectAll(".link")
      .data(links)
      .enter()
      .append("g")
      .attr("class", (d) => d.class());

    const text = textGroup
      .selectAll("text")
      .data((d: Link) => d.split().filter((l: Link) => l.hasMeta()))
      .enter()
      .append("text")
      .attr("class", (d: Link) => d.pathId()); // Bind text with pathId as class

    const textPath = text.append("textPath").attr("xlink:href", (d: Link) => `#${d.pathId()}`);

    textPath.each(function (d: Link) {
      Link.appendMetaText(this, d.metaList);
      Link.appendMetaText(this, d.sourceMeta);
      Link.appendMetaText(this, d.targetMeta);

      if (d.isLabelledPath()) Link.center(this);

      if (d.isReversePath()) Link.theOtherEnd(this);
    });

    Link.zoom(); // Initialize
    return [link, path, text];
  }

  private static theOtherEnd(container: SVGGElement) {
    d3.select(container).attr("class", "reverse").attr("text-anchor", "end").attr("startOffset", "100%");
  }

  private static center(container: SVGGElement) {
    d3.select(container).attr("class", "center").attr("text-anchor", "middle").attr("startOffset", "50%");
  }

  private static appendMetaText(container: SVGGElement, meta: MetaDataType[]) {
    meta.forEach((m) => {
      d3.select(container)
        .append("tspan")
        .attr("x", (d: Link) => d.tspanXOffset())
        .attr("dy", (d: Link) => d.tspanYOffset())
        .attr("class", m.class)
        .text(m.value);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static tick(link: d3.Selection<Link>, path: d3.Selection<Link>, label: d3.Selection<any>) {
    link
      .attr("x1", (d) => (d.source as Node).x)
      .attr("y1", (d) => (d.source as Node).y)
      .attr("x2", (d) => (d.target as Node).x)
      .attr("y2", (d) => (d.target as Node).y);

    if (path) path.attr("d", (d) => d.d());
    if (label)
      label.attr("transform", function (d: Link) {
        return d.rotate(this.getBBox());
      });
  }

  static zoom(scale?: number) {
    const visibility = scale && scale > 1.5 ? "visible" : "hidden";
    d3.selectAll(".link text").style("visibility", visibility);
  }

  static setPosition(link: d3.Selection<Link>, position: LinkPosition[]) {
    link
      .attr("x1", (d, i) => position[i].x1)
      .attr("y1", (d, i) => position[i].y1)
      .attr("x2", (d, i) => position[i].x2)
      .attr("y2", (d, i) => position[i].y2);
  }

  private shiftMultiplier() {
    if (!this._shiftMultiplier) {
      const members = this.group() || [];
      this._shiftMultiplier = members.indexOf(this.id) - (members.length - 1) / 2;
    }

    return this._shiftMultiplier;
  }

  static shiftBundle(
    link: d3.Selection<Link>,
    path: d3.Selection<Link>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    label: d3.Selection<any>,
    bundle: d3.Selection<Bundle>,
  ) {
    const transform = (d: Link) => d.shiftBundle(d.shiftMultiplier());

    link.attr("transform", transform);
    path.attr("transform", transform);
    label.attr("transform", transform);
    Bundle.shiftBundle(bundle);
  }

  shiftBundle(multiplier: number) {
    const gap = this.margin() * multiplier;

    const x = (this.target as Node).x - (this.source as Node).x;
    const y = (this.target as Node).y - (this.source as Node).y;
    const length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    return `translate(${(-gap * y) / length}, ${(gap * x) / length})`;
  }

  static reset() {
    Link.groups = null;
  }
}

const Eventable = (Base: typeof LinkBase) => {
  class EventableLink extends Base {
    private dispatch: d3.Dispatch;

    constructor(data: LinkDataType, id: number, options: LinkOptions) {
      super(data, id, options);

      this.dispatch = d3.dispatch("rendered");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static render(linkLayer, labelLayer, links): [d3.Selection<Link>, d3.Selection<Link>, d3.Selection<any>] {
      const [link, path, text] = super.render(linkLayer, labelLayer, links);

      link.each(function (this: SVGLineElement, d: Link & EventableLink) {
        d.dispatch.rendered(this);
      });

      return [link, path, text];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(name: string, callback: (element: SVGGElement) => any) {
      this.dispatch.on(name, callback);
    }
  }

  return EventableLink;
};

const Pluggable = (Base: typeof LinkBase) => {
  class Link extends Base {
    private static pluginConstructors: Constructor[] = [];

    constructor(data: LinkDataType, id: number, options: LinkOptions) {
      super(data, id, options);

      for (const constructor of Link.pluginConstructors) {
        // Call Pluggable at last as constructor may call methods defined in other classes
        constructor.bind(this)(data, id, options);
      }
    }

    static registerConstructor(func: Constructor) {
      Link.pluginConstructors.push(func);
    }
  }

  return Link;
};

class EventableLink extends Eventable(LinkBase) {}

// Call Pluggable at last as constructor may call methods defined in other classes
class Link extends Pluggable(EventableLink) {}

export { Link };
