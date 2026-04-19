import * as d3 from "d3";

import { Group } from "../../../src/group";
import { Link } from "../../../src/link";
import { Constructor as NodeConstructor, Node, NodeDataType, NodeOptions } from "../../../src/node";
import { PluginClass } from "../../../src/plugin";
import { classify } from "../../../src/util";

type Options = {
  showKey?: string;
  hideKey?: string;
};

class RemovableNode extends Node {
  public selected = false;

  public toggleSelected() {
    this.selected = !this.selected;
  }

  public reset() {
    this.selected = false;
  }

  public textColor() {
    return this.selected ? "red" : "black";
  }
}

export const RemovableNodePlugin: PluginClass = class RemovableNodePlugin {
  private static showKey = "Escape";
  private static hideKey = "d";

  static load(_groupClass: typeof Group, nodeClass: typeof Node, _linkClass: typeof Link, options: Options = {}) {
    if (options.showKey) {
      RemovableNodePlugin.showKey = options.showKey;
    }
    if (options.hideKey) {
      RemovableNodePlugin.hideKey = options.hideKey;
    }

    nodeClass.registerConstructor(function (
      this: Node,
      /* eslint-disable @typescript-eslint/no-unused-vars */
      data: NodeDataType,
      id: number,
      options: NodeOptions,
      /* eslint-enable @typescript-eslint/no-unused-vars */
    ) {
      (this as RemovableNode).selected = false;

      this.on("rendered", (element: SVGGElement) => {
        RemovableNodePlugin.configureRemovableNode(element);
      });
    } as NodeConstructor);

    RemovableNodePlugin.configureRemovableNodes();

    // Copy methods
    const nodeProto = nodeClass.prototype as unknown as RemovableNode;
    nodeProto.toggleSelected = RemovableNode.prototype.toggleSelected;
    nodeProto.reset = RemovableNode.prototype.reset;
    nodeProto.textColor = RemovableNode.prototype.textColor;
  }

  /**
   * Configure keyboard event listener to show or hide Nodes and Links
   */
  private static configureRemovableNodes() {
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
  private static configureRemovableNode(element: SVGGElement) {
    const d3Element = d3.select(element);
    d3Element.on("click.removableNode", function (this: SVGGElement, d: RemovableNode) {
      // Do nothing for dragging
      if ((d3.event as MouseEvent).defaultPrevented) {
        return;
      }

      d.toggleSelected();
      RemovableNodePlugin.applyColor(this);
    });
  }

  private static applyColor(element: SVGGElement) {
    d3.select(element)
      .select("text tspan")
      .style("fill", (d: RemovableNode) => d.textColor());
  }

  private static show() {
    d3.selectAll(".node")
      .style("display", "inline")
      .each(function (this: SVGGElement, d: RemovableNode) {
        d.reset();
        RemovableNodePlugin.applyColor(this);
      });

    RemovableNodePlugin.showLinks();
  }

  private static hide() {
    d3.selectAll(".node").style("display", (d: RemovableNode) => {
      if (d.selected) {
        // Hide connected elements
        RemovableNodePlugin.hideLinks(d.name);
        RemovableNodePlugin.hideToolTips(d.name);
        return "none";
      }

      return "inline";
    });
  }

  private static showLinks() {
    d3.selectAll(`.link`).style("display", "inline");
  }

  private static hideLinks(nodeName: string) {
    d3.selectAll(`.link.${classify(nodeName)}`).style("display", "none");
  }

  private static hideToolTips(nodeName: string) {
    d3.selectAll(`.tooltip.${classify(nodeName)}`).attr("visibility", "hidden");
  }
};

export default RemovableNodePlugin;
