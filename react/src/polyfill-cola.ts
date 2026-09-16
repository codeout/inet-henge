// inet-henge's hack_cola.js patches `cola.Layout.prototype` through a global `cola`. Only a <script> tag defines it.
// With a bundler or SSR, "cola" is a module, and inet-henge throws "ReferenceError: cola is not defined".
// Define the global here, before inet-henge is imported.
//
// Always overwrite it. inet-henge resolves "cola" to this module. The patch must hit this instance.
import * as cola from "cola";

(globalThis as Record<string, unknown>).cola = cola;

export const polyfilled = true;
