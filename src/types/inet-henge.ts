// Types shared across modules. A type only one module uses stays next to that module.

export type NodeDataType = {
  name: string;
  group: string[];
  icon: string;
  meta: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  class: string;
};

export type LinkDataType = {
  source: string;
  target: string;
  bundle?: number | string;
  meta: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  class: string;
};

export type InetHengeDataType = { nodes: NodeDataType[]; links: LinkDataType[] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HrefFunction = (object: any, type?: "node" | "link") => string;

// Fix @types/d3/index.d.ts. Should be "d3.scale.Ordinal<number, string>" but "d3.scale.Ordinal<string, string>"
// somehow.
export type Color = d3.scale.Ordinal<string, string>;
