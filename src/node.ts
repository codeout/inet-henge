import * as d3 from "d3";

import { Color } from "./diagram";
import { MetaData, MetaDataType } from "./meta_data";
import { NodePosition } from "./position_cache";
import { classify } from "./util";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor = (data: NodeDataType, id: number, options: NodeOptions) => void;

export type NodeDataType = {
  name: string;
  group: string[];
  icon: string;
  meta: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  class: string;
};

export type NodeOptions = {
  width: number;
  height: number;
  metaKeys: string[];
  color: Color;
  tooltip: boolean;
};

class NodeBase {
  private static all: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  public name: string;
  public group: string[];
  public metaList: MetaDataType[];
  public meta: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  public x: number;
  public y: number;

  private icon: string;
  private extraClass: string;
  private width: number;
  private height: number;
  private padding: number;
  private tspanOffset: string;

  constructor(data: NodeDataType, public id: number, private options: NodeOptions) {
    this.name = data.name;
    this.group = typeof data.group === "string" ? [data.group] : data.group || [];
    this.icon = data.icon;
    this.metaList = new MetaData(data.meta).get(options.metaKeys);
    this.meta = data.meta;
    this.extraClass = data.class || "";

    this.width = options.width || 60;
    this.height = options.height || 40;
    this.padding = 3;
    this.tspanOffset = "1.1em";

    this.register(id);
  }

  private register(id: number) {
    Node.all = Node.all || {};
    Node.all[this.name] = id;
  }

  transform() {
    const x = this.x - this.width / 2 + this.padding;
    const y = this.y - this.height / 2 + this.padding;
    return `translate(${x}, ${y})`;
  }

  private nodeWidth() {
    return this.width - 2 * this.padding;
  }

  private nodeHeight() {
    return this.height - 2 * this.padding;
  }

  private xForText() {
    return this.width / 2;
  }

  private yForText() {
    return this.height / 2;
  }

  static idByName(name: string) {
    if (Node.all[name] === undefined) throw `Unknown node "${name}"`;
    return Node.all[name];
  }

  public nodeId() {
    return classify(this.name);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static render(layer: d3.Selection<any>, nodes: Node[]) {
    const node: d3.Selection<Node> = layer
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("id", (d) => d.nodeId())
      .attr("name", (d) => d.name)
      .attr("transform", (d) => d.transform());

    node.each(function (this: SVGGElement, d) {
      if (d.icon) Node.appendImage(this);
      else Node.appendRect(this);

      Node.appendText(this);
    });

    return node;
  }

  private static appendText(container: SVGGElement) {
    const text = (d3.select(container) as d3.Selection<Node>)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", (d) => d.xForText())
      .attr("y", (d) => d.yForText());
    text
      .append("tspan")
      .text((d) => d.name)
      .attr("x", (d) => d.xForText());

    text.each((d) => {
      // Show meta only when "tooltip" option is not configured
      if (!d.options.tooltip) {
        Node.appendTspans(text, d.metaList);
      }
    });
  }

  private static appendTspans(container: d3.Selection<Node>, meta: MetaDataType[]) {
    meta.forEach((m) => {
      container
        .append("tspan")
        .attr("x", (d) => d.xForText())
        .attr("dy", (d) => d.tspanOffset)
        .attr("class", m.class)
        .text(m.value);
    });
  }

  private static appendImage(container: SVGGElement) {
    (d3.select(container) as d3.Selection<Node>)
      .attr("class", (d) => `node image ${classify(d.name)} ${d.extraClass}`)
      .append("image")
      .attr("xlink:href", (d) => d.icon)
      .attr("width", (d) => d.nodeWidth())
      .attr("height", (d) => d.nodeHeight());
  }

  private static appendRect(container: SVGGElement) {
    (d3.select(container) as d3.Selection<Node>)
      .attr("class", (d) => `node rect ${classify(d.name)} ${d.extraClass}`)
      .append("rect")
      .attr("width", (d) => d.nodeWidth())
      .attr("height", (d) => d.nodeHeight())
      .attr("rx", 5)
      .attr("ry", 5)
      .style("fill", (d) => d.options.color(undefined));
  }

  static tick(node: d3.Selection<Node>) {
    node.attr("transform", (d) => d.transform());
  }

  static setPosition(node: d3.Selection<Node>, position: NodePosition[]) {
    node.attr("transform", (d, i) => {
      if (
        position[i]?.x !== null &&
        position[i]?.x !== undefined &&
        position[i]?.y !== null &&
        position[i]?.y !== undefined
      ) {
        d.x = position[i].x;
        d.y = position[i].y;
      }
      return d.transform();
    });
  }

  static reset() {
    Node.all = null;
  }
}

const Eventable = (Base: typeof NodeBase) => {
  class EventableNode extends Base {
    private dispatch: d3.Dispatch;

    constructor(data: NodeDataType, id: number, options: NodeOptions) {
      super(data, id, options);

      this.dispatch = d3.dispatch("rendered");
    }

    static render(layer, nodes) {
      const node = super.render(layer, nodes);

      node.each(function (this: SVGGElement, d: Node & EventableNode) {
        d.dispatch.rendered(this);
      });

      return node;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(name: string, callback: (element: SVGGElement) => any) {
      this.dispatch.on(name, callback);
    }
  }

  return EventableNode;
};

const Pluggable = (Base: typeof NodeBase) => {
  class Node extends Base {
    private static pluginConstructors: Constructor[] = [];

    constructor(data: NodeDataType, id: number, options: NodeOptions) {
      super(data, id, options);

      for (const constructor of Node.pluginConstructors) {
        // Call Pluggable at last as constructor may call methods defined in other classes
        constructor.bind(this)(data, id, options);
      }
    }

    static registerConstructor(func: Constructor) {
      Node.pluginConstructors.push(func);
    }
  }

  return Node;
};

class EventableNode extends Eventable(NodeBase) {}

// Call Pluggable at last as constructor may call methods defined in other classes
class Node extends Pluggable(EventableNode) {}

export { Node };
