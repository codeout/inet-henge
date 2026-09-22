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

/**
 * Picks the fill color of a group rect and a node rect. The diagram writes the return value to the fill attribute,
 * which leaves a stylesheet free to override it. Defaults to d3.scale.category20().
 * @param key What is being colored: a group's index as a string, or the literal "node" for every node.
 * @returns Any CSS color, such as "#1f77b4" or "rebeccapurple".
 */
export type Color = (key: string) => string;
