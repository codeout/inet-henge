import * as d3 from "d3";

import { Constructor as LinkConstructor, Link, LinkDataType } from "../../../src/link";
import { Node } from "../../../src/node";
import { PluginClass } from "../../../src/plugin";

class ArrowsLink extends Link {
  public readonly source: number | Node;
  public readonly target: number | Node;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static tick(link: d3.Selection<ArrowsLink>, path: d3.Selection<ArrowsLink>, label: d3.Selection<any>) {
    super.tick(link, path, label);

    link.attr("x2", (d) => d.x2());
    link.attr("y2", (d) => d.y2());
  }

  length() {
    return Math.sqrt(
      ((this.source as Node).x - (this.target as Node).x) ** 2 +
        ((this.source as Node).y - (this.target as Node).y) ** 2,
    );
  }

  x2() {
    return (this.source as Node).x + (0.5 - 5 / this.length()) * ((this.target as Node).x - (this.source as Node).x);
  }

  y2() {
    return (this.source as Node).y + (0.5 - 5 / this.length()) * ((this.target as Node).y - (this.source as Node).y);
  }
}

export const ArrowsLinkPlugin: PluginClass = class ArrowsLinkPlugin {
  private static isMarkerDefined = false;

  static load(Group, Node, Link) {
    Link.registerConstructor(function (
      /* eslint-disable @typescript-eslint/no-unused-vars */
      data: LinkDataType,
      id: number,
      metaKeys: string[],
      linkWidth: (object) => number,
      /* eslint-enable @typescript-eslint/no-unused-vars */
    ) {
      this.selected = false;

      this.on("rendered", (element: SVGLineElement) => {
        ArrowsLinkPlugin.appendMarker(element);
        if (!ArrowsLinkPlugin.isMarkerDefined) {
          ArrowsLinkPlugin.defineMarkers();
        }
      });
    } as LinkConstructor);

    // Copy methods
    Link.tick = ArrowsLink.tick;
    Link.prototype.length = ArrowsLink.prototype.length;
    Link.prototype.x2 = ArrowsLink.prototype.x2;
    Link.prototype.y2 = ArrowsLink.prototype.y2;
  }

  private static defineMarkers() {
    const defs = d3.select("svg").append("defs");
    const define = (id: string) => {
      defs
        .append("marker")
        .attr("id", id)
        .attr("markerWidth", 10)
        .attr("markerHeight", 7)
        .attr("refX", 7.5)
        .attr("orient", "auto")
        .attr("viewBox", "0 -5 10 10")
        .append("path")
        .attr("d", "M0,-5 L10,0 L0,5");
    };

    define("marker-odd");
    define("marker-even");
    ArrowsLinkPlugin.isMarkerDefined = true;
  }

  private static appendMarker(element: SVGLineElement) {
    d3.select(element).attr(
      "marker-end",
      // For consistency with #links :nth-child(odd), it's one-based
      (d: ArrowsLink) => (d.id % 2 === 0 ? "url(#marker-odd)" : "url(#marker-even)"),
    );
  }
};

export default ArrowsLinkPlugin;
