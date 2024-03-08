import * as d3 from "d3";

import { Link } from "./link";
import { Node } from "./node";
import { Tooltip } from "./tooltip";
import { classify } from "./util";

export class LinkTooltip extends Tooltip {
  protected static type = "link" as const;

  constructor(private link: Link, eventType: string) {
    super(eventType, { offsetX: 10 });
  }

  transform() {
    const [x, y] = this.link.centerCoordinates();
    return `translate(${x}, ${y})`;
  }

  protected objectId(escape = false) {
    let id = classify(this.link.linkId());

    if (escape) {
      id = CSS.escape(id);
    }

    return id;
  }

  protected static appendText(container: SVGGElement) {
    const path = d3.select(container).append("path") as d3.Selection<LinkTooltip>;
    const text = d3.select(container).append("text") as d3.Selection<LinkTooltip>;

    LinkTooltip.appendNameValue(text, "source", (d) => (d.link.source as Node).name);
    text.each(function (d) {
      d.link.sourceMeta.forEach((m, i) => {
        LinkTooltip.appendNameValue(text, m.class, m.value, false);
      });
    });

    LinkTooltip.appendNameValue(text, "target", (d) => (d.link.target as Node).name, true);
    text.each(function (d) {
      d.link.targetMeta.forEach((m, i) => {
        LinkTooltip.appendNameValue(text, m.class, m.value, false);
      });
    });

    text.each(function (d) {
      d.link.metaList.forEach((m, i) => {
        LinkTooltip.appendNameValue(text, m.class, m.value, i === 0);
      });

      // Add "d" after bbox calculation
      const bbox = this.getBBox();
      path
        .attr("d", (d) => LinkTooltip.pathD(d.offsetX, 0, bbox.width + 40, bbox.height + 20))
        .style("fill", function () {
          return LinkTooltip.fill(this);
        });
    });
  }
}
