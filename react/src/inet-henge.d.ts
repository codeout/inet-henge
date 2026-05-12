declare module "inet-henge" {
  export class Diagram {
    constructor(
      container: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      urlOrData: string | { nodes: any[]; links: any[] },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options?: Record<string, any>,
    );
    init(...meta: string[]): void;
    on(name: string, callback: () => void): void;
    destroy(): void;
  }
}
