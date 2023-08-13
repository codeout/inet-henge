import * as d3 from "d3";

import { Node } from "./node";
import { Tooltip } from "./tooltip";
import { classify } from "./util";

export class NodeTooltip extends Tooltip {
  protected static type = "node" as const;

  constructor(private node: Node, eventType: string) {
    super(eventType);
  }

  transform() {
    return `translate(${this.node.x}, ${this.node.y})`;
  }

  protected objectId(escape = false) {
    let id = classify(this.node.name);

    if (escape) {
      id = CSS.escape(id);
    }

    return id;
  }

  protected static appendText(container: SVGGElement) {
    const path = d3.select(container).append("path") as d3.Selection<NodeTooltip>;

    const text = d3.select(container).append("text") as d3.Selection<NodeTooltip>;
    text
      .append("tspan")
      .attr("x", (d) => d.offsetX + 40)
      .attr("class", "name")
      .text("node:");
    const nodeName = text.append("tspan").attr("dx", 10).attr("class", "value");

    if (typeof this.href === "function") {
      nodeName
        .append("a")
        .attr("href", (d) => NodeTooltip.href(d))
        .text((d) => d.node.name);
    } else {
      nodeName.text((d) => d.node.name);
    }

    text.each(function (d) {
      NodeTooltip.appendTspans(text, d.node.metaList);

      // Add "d" after bbox calculation
      const bbox = this.getBBox();
      path.attr("d", NodeTooltip.pathD(30, 0, bbox.width + 40, bbox.height + 20)).style("fill", function () {
        return NodeTooltip.fill(this);
      });
    });
  }
}
