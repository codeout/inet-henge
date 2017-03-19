# inet-henge.js

inet-henge.js generates d3.js based Auto Layout Network Diagram from JSON data.  
inet-henge helps you draw it by calculating coordinates automatically, placing nodes and links in SVG format.

Each object is draggable and zoomable.

![stone-henge](https://c3.staticflickr.com/6/5480/11307043746_b3b36ccf34_h.jpg)

All you have to do are:

1. Define nodes identified by name
2. Define links by specifying both end nodes
3. Show in browser. That's it.

JSON example:

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

## Getting Started

```zsh
git clone https://github.com/codeout/inet-henge.git
```

Then host the ```/example``` directory in your favorite web server, or CSP agnostic browser, like Safari, can render it locally in your computer.


## Demo

[Shownet 2016 Network](https://inet-henge.herokuapp.com/)

## Usage

In example [here](example/shownet.html), load related assets at first:

* d3.js v3
* cola.js
  * :warning: **It doesn't support d3.js v4** :warning:
* inet-henge.js

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />

    <!-- You can customize a style of network diagram by CSS -->
    <link href="style.css" rel="stylesheet" />

    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.js"></script>
    <script src="../vendor/cola.min.js"></script>
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

inet-henge.js renders your network diagram as SVG within ```<div id="diagram"></div>```. In the example above the diagram also displays metadata labelled ```'interface'``` which defined in JSON data.

![Shownet2016 example](example/images/shownet.png)

### Node Group

Nodes get rendered in groups when you specify which node belongs to which group by regular expression.

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

You can specify node icon by URL:

```json
  "nodes": [
    { "name": "dceast-ne40e", "icon": "./images/router.png" }
  ]
```

Metadata to display on network diagrams:

```json
  "links": [
    {
      "source": "noc-asr9904", "target": "noc-ax8616r",
      "meta": {
        "interface": { "source": "0-0-0-2", "target": "1-1" }
      }
    }
  ]
```

:point_up: This will render metadata on the both ends of links.


## Contributing

Please report issues or enhancement requests to [GitHub issues](https://github.com/codeout/inet-henge/issues).
For questions or feedbacks write to my twitter @codeout.

Or send a pull request to fix.


## Copyright and License

Copyright (c) 2017 Shintaro Kojima. Code released under the [MIT license](LICENSE).
