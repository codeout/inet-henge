type NodeOffset = {
  node: number;
  offset: number;
};

export type WebColaConstraint = {
  type: "alignment";
  axis: "x" | "y";
  offsets: NodeOffset[];
};
