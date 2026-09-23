// the shape this package builds for webcola's Layout.constraints(), which types its argument as Array<any>

type NodeOffset = {
  node: number;
  offset: number;
};

export type WebColaConstraint = {
  type: "alignment";
  axis: "x" | "y";
  offsets: NodeOffset[];
};
