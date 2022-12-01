export interface PluginClass {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load(groupClass, nodeClass, linkClass, options: Record<string, any>): void;
}
