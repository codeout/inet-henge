import * as d3 from "d3";

import { Constructor as NodeConstructor, Node, NodeDataType, NodeOptions } from "../../../src/node";
import { PluginClass } from "../../../src/plugin";
import { classify } from "../../../src/util";

type Options = {
  showKey?: string;
  hideKey?: string;
}

class RemovableNode extends Node {
  public selected;

  public toggleSelected(): void {
    this.selected = !this.selected;
  }

  public reset(): void {
    this.selected = false;
  }

  public textColor(): string {
    return this.selected ? "red" : "black";
  }
}

export const RemovableNodePlugin: PluginClass = class RemovableNodePlugin {
  private static showKey = "Escape";
  private static hideKey = "d";

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static load(Group, Node, Link, options: Options = {}): void {
    if (options.showKey) {
      RemovableNodePlugin.showKey = options.showKey;
    }
    if (options.hideKey) {
      RemovableNodePlugin.hideKey = options.hideKey;
    }

    // Fix @types/d3/index.d.ts. Should be "d3.scale.Ordinal<number, string>" but "d3.scale.Ordinal<string, string>" somehow
    // Also, it should have accepted undefined
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    Node.registerConstructor(function(data: NodeDataType, id: number, options: NodeOptions) {
      this.selected = false;

      this.on("rendered", (element: SVGGElement) => {
        RemovableNodePlugin.configureRemovableNode(element);
      });

    } as NodeConstructor);

    RemovableNodePlugin.configureRemovableNodes();

    // Copy methods
    Node.prototype.toggleSelected = RemovableNode.prototype.toggleSelected;
    Node.prototype.reset = RemovableNode.prototype.reset;
    Node.prototype.textColor = RemovableNode.prototype.textColor;
  }

  /**
   * Configure keyboard event listener to show or hide Nodes and Links
   */
  private static configureRemovableNodes(): void {
    d3.select("body").on("keydown", () => {
      switch ((d3.event as KeyboardEvent).key) {
        case RemovableNodePlugin.showKey:
          RemovableNodePlugin.show();
          break;
        case RemovableNodePlugin.hideKey:
          RemovableNodePlugin.hide();
      }
    });
  }

  /**
   * Configure click event listener to select Nodes
   */
  private static configureRemovableNode(element: SVGGElement): void {
    const d3Element = d3.select(element);
    d3Element.on("click.removableNode", function(this: SVGGElement, d: RemovableNode) {
      // Do nothing for dragging
      if ((d3.event as MouseEvent).defaultPrevented) {
        return;
      }

      d.toggleSelected();
      RemovableNodePlugin.applyColor(this);
    });
  }

  private static applyColor(element: SVGGElement): void {
    d3.select(element).select("text tspan").style("fill", (d: RemovableNode) => d.textColor());
  }

  private static show(): void {
    d3.selectAll(".node")
      .style("display", "inline")
      .each(function(this: SVGGElement, d: RemovableNode) {
        d.reset();
        RemovableNodePlugin.applyColor(this);
      });

    RemovableNodePlugin.showLinks();
  }

  private static hide(): void {
    d3.selectAll(".node")
      .style("display", (d: RemovableNode) => {
        if (d.selected) {
          // Hide connected elements
          RemovableNodePlugin.hideLinks(d.name);
          RemovableNodePlugin.hideToolTips(d.name);
          return "none";
        }

        return "inline";
      });
  }

  private static showLinks(): void {
    d3.selectAll(`.link`)
      .style("display", "inline");
  }

  private static hideLinks(nodeName: string): void {
    d3.selectAll(`.link.${classify(nodeName)}`)
      .style("display", "none");
  }

  private static hideToolTips(nodeName: string): void {
    d3.selectAll(`.tooltip.${classify(nodeName)}`)
      .attr("visibility", "hidden");
  }
};

export default RemovableNodePlugin;
