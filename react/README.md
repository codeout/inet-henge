# inet-henge-react

React component for [inet-henge](https://github.com/codeout/inet-henge) network diagrams.

## Getting Started

```zsh
npm install inet-henge-react inet-henge
```

`inet-henge` is a peer dependency. Install it alongside. `d3` and `cola` come with this package.

```jsx
"use client";

import { InetHenge } from "inet-henge-react";

export function Diagram() {
  return (
    <div style={{ height: "100vh" }}>
      <InetHenge data="/network.json" meta={["interface"]} />
    </div>
  );
}
```

The component renders a `<div>`. inet-henge draws an SVG inside it. It runs in the browser only. Keep it in a client
component.

## Sizing

Without `width` and `height` the component measures its own container once, when it mounts. The container fills its
parent unless `style` says otherwise. The diagram therefore takes the size of the parent. Give the parent a height. An
element with no height measures zero, and inet-henge falls back to its own default.

Pass `width` and `height` to size the diagram yourself. The component does not follow later resizes.

## Props

| Prop                     | Type                         | Description                                                |
| ------------------------ | ---------------------------- | ---------------------------------------------------------- |
| `data`                   | `string \| { nodes, links }` | URL to fetch, or the data itself                           |
| `meta`                   | `string[]`                   | Metadata keys to render as labels                          |
| `width` `height`         | `number`                     | Diagram size in px, measured from the container if omitted |
| `nodeWidth` `nodeHeight` | `number`                     | Node size in px                                            |
| `groupPadding`           | `number`                     | Padding around groups                                      |
| `initialTicks` `ticks`   | `number`                     | Layout iterations                                          |
| `positionCache`          | `boolean \| "fixed"`         | Remember node positions in localStorage                    |
| `positionHint`           | `{ nodeCallback }`           | Initial position of each node                              |
| `positionConstraints`    | `{ axis, nodesCallback }[]`  | Alignment constraints                                      |
| `distance`               | `number \| (cola) => number` | Link distance                                              |
| `bundle`                 | `boolean`                    | Draw tie marks over bundled links                          |
| `pop`                    | `RegExp`                     | Group nodes by the matched part of their name              |
| `tooltip`                | `"click" \| "hover"`         | What opens a tooltip                                       |
| `href`                   | `(object, type) => string`   | Link target of a tooltip                                   |
| `onRendered`             | `() => void`                 | Called once the diagram is drawn                           |
| `className` `style`      |                              | Applied to the container                                   |

Every prop but `onRendered`, `className` and `style` goes to the `Diagram` constructor.
[The inet-henge README](https://github.com/codeout/inet-henge#usage) describes what each one does.

Changing a prop rebuilds the diagram, which recalculates the layout. Keep `data` referentially stable. A new object on
every render redraws the diagram every time.

## Styling

inet-henge draws with presentation attributes. A plain stylesheet overrides them.

```css
.node rect {
  fill: #1f77b4;
}
```

## Copyright and License

Copyright (c) 2016-2026 Shintaro Kojima. Code released under the [MIT license](LICENSE).
