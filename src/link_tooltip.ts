import * as d3 from "d3";

import type { Link } from "./link";
import type { Node } from "./node";
import { Tooltip } from "./tooltip";
import { classify } from "./util";

export class LinkTooltip extends Tooltip {
  protected static type = "link" as const;

  constructor(
    private link: Link,
    eventType: string,
  ) {
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
      for (const m of d.link.sourceMeta) {
        LinkTooltip.appendNameValue(text, m.class, m.value, false);
      }
    });

    LinkTooltip.appendNameValue(text, "target", (d) => (d.link.target as Node).name, true);
    text.each(function (d) {
      for (const m of d.link.targetMeta) {
        LinkTooltip.appendNameValue(text, m.class, m.value, false);
      }
    });

    text.each(function (this: SVGTextElement, d: LinkTooltip) {
      for (const [i, m] of d.link.metaList.entries()) {
        LinkTooltip.appendNameValue(text, m.class, m.value, i === 0);
      }

      // add "d" after bbox calculation
      const bbox = this.getBBox();
      path
        .attr("d", (d) => LinkTooltip.pathD(d.offsetX, 0, bbox.width + 40, bbox.height + 20))
        .each(function (this: SVGPathElement) {
          const fill = LinkTooltip.fill(this);
          if (fill) d3.select(this).style("fill", fill);
        });
    });
  }
}
