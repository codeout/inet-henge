"use client";

import "./polyfill-self";
import "./polyfill-cola";
import "./polyfill-d3";

import { Diagram } from "inet-henge";
import type { CSSProperties } from "react";
import { useEffect, useId } from "react";

export type NodeDataType = {
  name: string;
  group?: string | string[];
  icon?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
  class?: string;
};

export type LinkDataType = {
  source: string;
  target: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
  bundle?: string | number;
  class?: string;
};

export type InetHengeDataType = {
  nodes: NodeDataType[];
  links: LinkDataType[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HrefFunction = (object: any, type?: "node" | "link") => string;

export type DiagramNode = {
  id: number;
  name: string;
  group: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: Record<string, any>;
  x: number;
  y: number;
};

export type NodePosition = { x: number; y: number };

export type PositionHint = {
  nodeCallback?: (node: DiagramNode) => NodePosition | null | undefined;
};

export type PositionConstraint = {
  axis: "x" | "y";
  nodesCallback: (nodes: DiagramNode[]) => DiagramNode[][];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DistanceOption = number | ((cola: any) => number);

export type InetHengeProps = {
  data: string | InetHengeDataType;
  meta?: string[];
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  groupPadding?: number;
  initialTicks?: number;
  ticks?: number;
  positionCache?: boolean | string;
  positionHint?: PositionHint;
  positionConstraints?: PositionConstraint[];
  distance?: DistanceOption;
  bundle?: boolean;
  pop?: RegExp;
  tooltip?: string;
  href?: HrefFunction;
  onRendered?: () => void;
  className?: string;
  style?: CSSProperties;
};

export function InetHenge({ data, meta, onRendered, className, style, ...options }: InetHengeProps) {
  // The id has to survive hydration. Diagram looks the container up by selector, and a selector that matches nothing
  // makes d3 draw nothing at all. useId() returns the same value on the server and on the client.
  //
  // - "_R_1_" with react 19
  // - ":R1:"  with react 18
  //
  // React 18 wraps the value in colons, which a CSS selector rejects. React 19 uses underscores instead. Keep the part
  // that is valid in an id, and both work.
  const id = `inet-henge-${useId().replaceAll(/[^\w-]/g, "")}`;

  // a changed option has to rebuild it
  const optionsKey = JSON.stringify({ meta, onRendered, ...options }, (_, value) =>
    typeof value === "function" || value instanceof RegExp ? String(value) : value,
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const diagram = new Diagram(`#${id}`, data, options as any);
    if (onRendered) {
      diagram.on("rendered", onRendered);
    }
    diagram.init(...(meta ?? []));

    return () => {
      diagram.destroy();
    };
    // optionsKey covers options, meta and onRendered. The rule cannot see that. data stays a reference. Serializing
    // every node and link on every render costs too much.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, id, optionsKey]);

  return <div className={className} id={id} style={style} />;
}
