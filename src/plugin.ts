import { Group } from "./group";
import { Link } from "./link";
import { Node } from "./node";

export interface PluginClass {
  load(
    groupClass: typeof Group,
    nodeClass: typeof Node,
    linkClass: typeof Link,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: Record<string, any>,
  ): void;
}
