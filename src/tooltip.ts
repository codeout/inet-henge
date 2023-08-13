import * as d3 from "d3";

import { HrefFunction } from "./diagram";
import { MetaDataType } from "./meta_data";

export abstract class Tooltip {
  static href: HrefFunction;
  protected static type: "node" | "link";

  protected offsetX: number;
  private visibility: string;

  constructor(private eventType: string) {
    this.offsetX = 30;
    this.visibility = "hidden";
  }

  protected tspanOffsetY(isHeader: boolean) {
    return isHeader ? "2em" : "1.1em";
  }

  transform(): string {
    throw new Error("not implemented");
  }

  private class() {
    return `tooltip ${(this.constructor as typeof Tooltip).type}-tooltip ${this.objectId()}`;
  }

  // Object id which has this tooltip
  protected abstract objectId(boolean?): string;

  private setVisibility(visibility: string | null) {
    this.visibility = visibility === "visible" ? "visible" : "hidden";
  }

  // This doesn't actually toggle visibility, but returns string for toggled visibility
  private toggleVisibility() {
    this.visibility = this.visibility === "hidden" ? "visible" : "hidden";
    return this.visibility;
  }

  private toggleVisibilityCallback(element: SVGGElement) {
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

  private configureObjectClickCallback(element: SVGGElement) {
    d3.select(`#${this.objectId(true)}`).on("click.tooltip", this.toggleVisibilityCallback(element));
  }

  private configureObjectHoverCallback(element: SVGGElement) {
    d3.select(`#${this.objectId(true)}`).on("mouseenter.tooltip", this.toggleVisibilityCallback(element));
    d3.select(`#${this.objectId(true)}`).on("mouseleave.tooltip", this.toggleVisibilityCallback(element));
  }

  // Make tooltip selectable
  private disableZoom(element: SVGGElement) {
    d3.select(element).on("mousedown.tooltip", () => {
      (d3.event as MouseEvent).stopPropagation();
    });
  }

  static setHref(callback: HrefFunction) {
    if (callback) this.href = callback;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static render<T extends Tooltip>(layer: d3.Selection<any>, tooltips: T[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const cls = this;
    const tooltip = layer
      .selectAll(`.tooltip.${cls.type}-tooltip`)
      .data(tooltips)
      .enter()
      .append("g")
      .attr("visibility", (d) => d.visibility)
      .attr("class", (d) => d.class())
      .attr("transform", (d) => d.transform());

    tooltip.each(function (d) {
      cls.appendText(this);

      if (d.eventType === "hover") {
        d.configureObjectHoverCallback(this);
      } else {
        d.configureObjectClickCallback(this);
      }

      d.disableZoom(this);
    });

    return tooltip;
  }

  protected static fill(element: SVGPathElement) {
    // If no "fill" style is defined
    if (getComputedStyle(element).fill.match(/\(0,\s*0,\s*0\)/)) {
      return "#f8f1e9";
    }
  }

  protected static pathD(x: number, y: number, width: number, height: number) {
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

  protected static appendText(container: SVGGElement) {
    throw new Error("not implemented");
  }

  protected static appendTspans<T extends Tooltip>(container: d3.Selection<T>, meta: MetaDataType[]) {
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

  static followObject(tooltip: d3.Selection<Tooltip>) {
    tooltip.attr("transform", (d) => d.transform());
  }
}
