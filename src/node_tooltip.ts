import * as d3 from "d3";

import { Node } from "./node";
import { Tooltip } from "./tooltip";

export class NodeTooltip extends Tooltip {
  protected static type = "node" as const;

  constructor(
    private node: Node,
    eventType: string,
  ) {
    super(eventType);
  }

  transform() {
    return `translate(${this.node.x}, ${this.node.y})`;
  }

  protected objectId(escape = false) {
    let id = this.node.nodeId();

    if (escape) {
      id = CSS.escape(id);
    }

    return id;
  }

  protected static appendText(container: SVGGElement) {
    const path = d3.select(container).append("path") as d3.Selection<NodeTooltip>;
    const text = d3.select(container).append("text") as d3.Selection<NodeTooltip>;

    NodeTooltip.appendNameValue(text, "node", (d) => d.node.name);

    text.each(function (d) {
      d.node.metaList.forEach((m, i) => {
        NodeTooltip.appendNameValue(text, m.class, m.value, i === 0);
      });

      // Add "d" after bbox calculation
      const bbox = this.getBBox();
      path
        .attr("d", (d) => NodeTooltip.pathD(d.offsetX, 0, bbox.width + 40, bbox.height + 20))
        .style("fill", function () {
          return NodeTooltip.fill(this);
        });
    });
  }
}
