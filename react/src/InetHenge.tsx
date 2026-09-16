"use client";

import "./polyfill-self";
import "./polyfill-cola";
import "./polyfill-d3";

import { Diagram } from "inet-henge";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

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

let idCounter = 0;

export function InetHenge({ data, meta, onRendered, className, style, ...options }: InetHengeProps) {
  const idRef = useRef<string | null>(null);
  if (idRef.current === null) {
    idRef.current = `inet-henge-${++idCounter}`;
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const diagram = new Diagram(`#${idRef.current}`, data, options as any);
    if (onRendered) {
      diagram.on("rendered", onRendered);
    }
    diagram.init(...(meta ?? []));

    return () => {
      diagram.destroy();
    };
  }, [data]);

  return <div className={className} id={idRef.current} style={style} />;
}
