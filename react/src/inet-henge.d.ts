// The core ships no types, so this stands in for them. A top-level import would make this file a module, which
// turns the declaration into an augmentation of a module that does not exist. Inline import() is the only way
// left to reach the types next door.

/* eslint-disable @typescript-eslint/consistent-type-imports */
declare module "inet-henge" {
  export class Diagram {
    constructor(
      container: string,
      urlOrData: string | import("./InetHenge").InetHengeDataType,
      options?: import("./InetHenge").DiagramOptions,
    );
    init(...meta: string[]): void;
    on(name: string, callback: () => void): void;
    destroy(): void;
  }
}
