// webcola's d3 v3 adaptor reads a global `d3`. Only a <script> tag defines it.
// inet-henge calls cola.d3adaptor() without arguments. That always selects the v3 adaptor.
// Define the global here. The adaptor also reads d3.event while dragging. The global must stay in place.
//
// d3 v3 has no named exports. A default import gives the module object itself, which is what inet-henge
// gets from require("d3"). Always overwrite the global. Both must see the same instance.
import d3 from "d3";

(globalThis as Record<string, unknown>).d3 = d3;

export const polyfilled = true;
