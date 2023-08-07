import * as d3 from "d3";

import { HrefFunction } from "./diagram";
import { MetaDataType } from "./meta_data";
import { Node } from "./node";
import { classify } from "./util";

export class Tooltip {
  static href: HrefFunction;
  private offsetX: number;
  private visibility: string;

  constructor(private node: Node, private eventType: string) {
    this.offsetX = 30;
    this.visibility = "hidden";
  }

  tspanOffsetY(isHeader: boolean) {
    return isHeader ? "2em" : "1.1em";
  }

  transform() {
    return `translate(${this.node.x}, ${this.node.y})`;
  }

  class() {
    return `tooltip ${this.nodeId()}`;
  }

  nodeId(escape = false) {
    let id = classify(this.node.name);

    if (escape) {
      id = CSS.escape(id);
    }

    return id;
  }

  setVisibility(visibility: string | null) {
    this.visibility = visibility === "visible" ? "visible" : "hidden";
  }

  // This doesn't actually toggle visibility, but returns string for toggled visibility
  toggleVisibility() {
    this.visibility = this.visibility === "hidden" ? "visible" : "hidden";
    return this.visibility;
  }

  toggleVisibilityCallback(element: SVGGElement) {
    return () => {
      // Do nothing for dragging
      if ((d3.event as MouseEvent).defaultPrevented) {
        return;
      }

      d3.select(element)
        .attr("visibility", function (d) {
          // Sync visibility before toggling. External script may change the visibility.
          d.setVisibility(this.getAttribute("visibility"));
          return d.toggleVisibility();
        })
        // bootstrap.css unexpectedly sets "opacity: 0". Reset if it's visible.
        .style("opacity", function (d) {
          return d.visibility === "visible" ? 1 : null;
        });
    };
  }

  configureNodeClickCallback(element: SVGGElement) {
    d3.select(`#${this.nodeId(true)}`).on("click.tooltip", this.toggleVisibilityCallback(element));
  }

  configureNodeHoverCallback(element: SVGGElement) {
    d3.select(`#${this.nodeId(true)}`).on("mouseenter.tooltip", this.toggleVisibilityCallback(element));
    d3.select(`#${this.nodeId(true)}`).on("mouseleave.tooltip", this.toggleVisibilityCallback(element));
  }

  // Make tooltip selectable
  disableZoom(element: SVGGElement) {
    d3.select(element).on("mousedown.tooltip", () => {
      (d3.event as MouseEvent).stopPropagation();
    });
  }

  static setHref(callback: HrefFunction) {
    if (callback) this.href = callback;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static render(layer: d3.Selection<any>, tooltips: Tooltip[]) {
    const tooltip = layer
      .selectAll(".tooltip")
      .data(tooltips)
      .enter()
      .append("g")
      .attr("visibility", (d) => d.visibility)
      .attr("class", (d) => d.class())
      .attr("transform", (d) => d.transform());

    tooltip.each(function (d) {
      Tooltip.appendText(this);

      if (d.eventType === "hover") {
        d.configureNodeHoverCallback(this);
      } else {
        d.configureNodeClickCallback(this);
      }

      d.disableZoom(this);
    });

    return tooltip;
  }

  private static fill(element: SVGPathElement) {
    // If no "fill" style is defined
    if (getComputedStyle(element).fill.match(/\(0,\s*0,\s*0\)/)) {
      return "#f8f1e9";
    }
  }

  private static pathD(x: number, y: number, width: number, height: number) {
    const round = 8;

    return (
      `M ${x},${y} L ${x + 20},${y - 10} ${x + 20},${y - 20}` +
      `Q ${x + 20},${y - 20 - round} ${x + 20 + round},${y - 20 - round}` +
      `L ${x + 20 + width - round},${y - 20 - round}` +
      `Q ${x + 20 + width},${y - 20 - round} ${x + 20 + width},${y - 20}` +
      `L ${x + 20 + width},${y - 20 + height}` +
      `Q ${x + 20 + width},${y - 20 + height + round} ${x + 20 + width - round},${y - 20 + height + round}` +
      `L ${x + 20 + round},${y - 20 + height + round}` +
      `Q ${x + 20},${y - 20 + height + round} ${x + 20},${y - 20 + height}` +
      `L ${x + 20},${y + 10} Z`
    );
  }

  private static appendText(container: SVGGElement) {
    const path = d3.select(container).append("path") as d3.Selection<Tooltip>;

    const text = d3.select(container).append("text") as d3.Selection<Tooltip>;
    text
      .append("tspan")
      .attr("x", (d) => d.offsetX + 40)
      .attr("class", "name")
      .text("node:");
    const nodeName = text.append("tspan").attr("dx", 10).attr("class", "value");

    if (typeof this.href === "function") {
      nodeName
        .append("a")
        .attr("href", (d) => Tooltip.href(d))
        .text((d) => d.node.name);
    } else {
      nodeName.text((d) => d.node.name);
    }

    text.each(function (d) {
      Tooltip.appendTspans(text, d.node.metaList);

      // Add "d" after bbox calculation
      const bbox = this.getBBox();
      path.attr("d", Tooltip.pathD(30, 0, bbox.width + 40, bbox.height + 20)).style("fill", function () {
        return Tooltip.fill(this);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static appendTspans(container: d3.Selection<Tooltip>, meta: MetaDataType[]) {
    meta.forEach((m, i) => {
      container
        .append("tspan")
        .attr("x", (d) => d.offsetX + 40)
        .attr("dy", (d) => d.tspanOffsetY(i === 0))
        .attr("class", "name")
        .text(`${m.class}:`);

      container.append("tspan").attr("dx", 10).attr("class", "value").text(m.value);
    });
  }

  static followNode(tooltip: d3.Selection<Tooltip>) {
    tooltip.attr("transform", (d) => d.transform());
  }
}
