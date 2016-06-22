# inet-henge.js

Generate d3.js based Network Diagram from JSON data.

## Getting Started

To be updated

* Requirements: [cola.js](http://marvl.infotech.monash.edu/webcola/)

## Demo

[Shownet 2016 Network](https://inet-henge.herokuapp.com/)

## Usage

In example [here](example/shownet.html), load related assets first:

* d3.js
* cola.js
* inet-henge.js

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link href="style.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.js"></script>
    <script src="../vendor/cola.3.1.3.min.js"></script>
    <script src="../inet-henge.js"></script>
  </head>
```

define a blank container:


```html
  <body>
    <div id="diagram"></div>
  </body>
```

and render your network diagram:

```html
  <script>
   new Diagram('#diagram', 'shownet.json').init('interface');
  </script>
</html>
```

inet-henge.js renders your network diagram as SVG within ```<div id="diagram"></div>```. In this example the diagram also displays metadata labelled ```'interface'``` which defined in JSON data.

![Shownet2016 example](example/images/shownet.png)

### Node Group

Nodes can be grouped when a regular expression for node name is specified to determine which node belongs to which group.

When the first three characters describe POP name, you can group nodes by doing this:

``` javascript
var diagram = new Diagram('#diagram', 'data.json', {pop: /^.{3}/})
```

### JSON Data

Minimal json looks like:

```json
{
  "nodes": [
    { "name": "A" },
    { "name": "B" }
  ],

  "links": [
    { "source": "A", "target": "B" }
  ]
}
```

You can specify icon for each node:

```json
{
  "nodes": [
    { "name": "dceast-ne40e", "icon": "./images/router.png" },
```

Or metadata to display on network diagrams.

```json
    { "name": "dceast-fx1-1", "meta": { "loopback": "10.0.0.1" } },
    ...
  ],
  "links": [
    { "source": "noc-asr9904", "target": "noc-ax8616r",
      "meta": { "interface": { "source": "0-0-0-2", "target": "1-1" } }
```

metadata for links should be described in the format:

```json
"name": { "source": "data for source", "target": "data for target" }
```

## Contributing

Please report issues or enhancement requests to [GitHub issues](https://github.com/codeout/inet-henge/issues).
For questions or feedbacks write to my twitter @codeout.

Or send a pull request to fix.


## Copyright and License

Copyright (c) 2016 Shintaro Kojima. Code released under the [MIT license](LICENSE).
