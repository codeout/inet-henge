import * as d3 from "d3";

import { MetaData, MetaDataType } from "./meta_data";
import { NodePosition } from "./position_cache";
import { classify } from "./util";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor = (data: NodeDataType, id: number, metaKeys: string[], color: any, tooltip: boolean) => void;

export type NodeDataType = {
  name: string,
  group: string[],
  icon: string,
  meta: Record<string, any>,  // eslint-disable-line @typescript-eslint/no-explicit-any
  class: string,
}

class NodeBase {
  private static all: Record<string, any>;  // eslint-disable-line @typescript-eslint/no-explicit-any

  public name: string;
  public group: string[];
  public metaList: MetaDataType[];
  public meta: Record<string, any>;  // eslint-disable-line @typescript-eslint/no-explicit-any
  public x: number;
  public y: number;

  private icon: string;
  private extraClass: string;
  private width: number;
  private height: number;
  private padding: number;
  private tspanOffset: string;

  // Fix @types/d3/index.d.ts. Should be "d3.scale.Ordinal<number, string>" but "d3.scale.Ordinal<string, string>" somehow
  // Also, it should have accepted undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: NodeDataType, public id: number, metaKeys: string[], private color: any, private tooltip: boolean) {
    this.name = data.name;
    this.group = typeof data.group === "string" ? [data.group] : (data.group || []);
    this.icon = data.icon;
    this.metaList = new MetaData(data.meta).get(metaKeys);
    this.meta = data.meta;
    this.extraClass = data.class || "";

    this.width = 60;
    this.height = 40;
    this.padding = 3;
    this.tspanOffset = "1.1em";

    this.register(id, data.name);
  }

  register(id: number, name: string): void {
    Node.all = Node.all || {};
    Node.all[name] = id;
  }

  transform(): string {
    const x = this.x - this.width / 2 + this.padding;
    const y = this.y - this.height / 2 + this.padding;
    return `translate(${x}, ${y})`;
  }

  nodeWidth(): number {
    return this.width - 2 * this.padding;
  }

  nodeHeight(): number {
    return this.height - 2 * this.padding;
  }

  xForText(): number {
    return this.width / 2;
  }

  yForText(): number {
    return this.height / 2;
  }

  static idByName(name: string): number {
    if (Node.all[name] === undefined)
      throw `Unknown node "${name}"`;
    return Node.all[name];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static render(layer: d3.Selection<any>, nodes: Node[]): d3.Selection<Node> {
    const node = layer.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("id", (d) => classify(d.name))
      .attr("name", (d) => d.name)
      .attr("transform", (d) => d.transform());

    node.each(function(this: SVGGElement, d) {
      if (d.icon)
        Node.appendImage(this);
      else
        Node.appendRect(this);

      Node.appendText(this);
    });

    return node;
  }

  private static appendText(container: SVGGElement): void {
    const text = (d3.select(container) as d3.Selection<Node>).append("text")
      .attr("text-anchor", "middle")
      .attr("x", (d) => d.xForText())
      .attr("y", (d) => d.yForText());
    text.append("tspan")
      .text((d) => d.name)
      .attr("x", (d) => d.xForText());

    text.each((d) => {
      // Show meta only when "tooltip" option is not configured
      if (!d.tooltip) {
        Node.appendTspans(text, d.metaList);
      }
    });
  }

  private static appendTspans(container: d3.Selection<Node>, meta: MetaDataType[]): void {
    meta.forEach((m) => {
      container.append("tspan")
        .attr("x", (d) => d.xForText())
        .attr("dy", (d) => d.tspanOffset)
        .attr("class", m.class)
        .text(m.value);
    });
  }

  private static appendImage(container: SVGGElement): void {
    (d3.select(container) as d3.Selection<Node>)
      .attr("class", (d) => `node image ${classify(d.name)} ${d.extraClass}`)
      .append("image")
      .attr("xlink:href", (d) => d.icon)
      .attr("width", (d) => d.nodeWidth())
      .attr("height", (d) => d.nodeHeight());
  }

  private static appendRect(container: SVGGElement): void {
    (d3.select(container) as d3.Selection<Node>)
      .attr("class", (d) => `node rect ${classify(d.name)} ${d.extraClass}`)
      .append("rect")
      .attr("width", (d) => d.nodeWidth())
      .attr("height", (d) => d.nodeHeight())
      .attr("rx", 5)
      .attr("ry", 5)
      .style("fill", (d) => d.color());
  }

  static tick(node: d3.Selection<Node>): void {
    node.attr("transform", (d) => d.transform());
  }

  static setPosition(node: d3.Selection<Node>, position: NodePosition[]): void {
    node.attr("transform", (d, i) => {
      d.x = position[i].x;
      d.y = position[i].y;
      return d.transform();
    });
  }

  static reset(): void {
    Node.all = null;
  }
}

const Eventable = (Base: typeof NodeBase) => {
  class EventableNode extends Base {
    private dispatch: d3.Dispatch;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data: NodeDataType, id: number, metaKeys: string[], color: any, tooltip: boolean) {
      super(data, id, metaKeys, color, tooltip);

      this.dispatch = d3.dispatch("rendered");
    }

    static render(layer, nodes) {
      const node = super.render(layer, nodes);

      node.each(function(this: SVGGElement, d: Node & EventableNode) {
        d.dispatch.rendered(this);
      });

      return node;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(name: string, callback: (element: SVGGElement) => any): void {
      this.dispatch.on(name, callback);
    }
  }

  return EventableNode;
};

const Pluggable = (Base: typeof NodeBase) => {
  class Node extends Base {
    private static pluginConstructors: Constructor[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data: NodeDataType, id: number, metaKeys: string[], color: any, tooltip: boolean) {
      super(data, id, metaKeys, color, tooltip);

      for (const constructor of Node.pluginConstructors) {
        // Call Pluggable at last as constructor may call methods defined in other classes
        constructor.bind(this)(data, id, metaKeys, color, tooltip);
      }
    }

    static registerConstructor(func: Constructor): void {
      Node.pluginConstructors.push(func);
    }
  }

  return Node;
};

class EventableNode extends Eventable(NodeBase) {
}

// Call Pluggable at last as constructor may call methods defined in other classes
class Node extends Pluggable(EventableNode) {
}

export { Node };
