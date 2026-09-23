const g = globalThis as Record<string, unknown>;
if (g.self === undefined) {
  g.self = globalThis;
}

// This file has no import. The export is what makes it a module, which keeps g out of the global type space.
export const polyfilled = true;
