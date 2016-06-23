(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _group = require('./group');

var _group2 = _interopRequireDefault(_group);

var _link = require('./link');

var _link2 = _interopRequireDefault(_link);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Diagram = function () {
  function Diagram(container, url, options) {
    _classCallCheck(this, Diagram);

    options = options || {};

    this.selector = container;
    this.url = url;
    this.group_pattern = options.pop;
    this.width = options.width || 960;
    this.height = options.height || 600;

    this.set_distance = this.link_distance(options.distance || 150);
    this.color = d3.scale.category20();
    this.max_ticks = 1000;
  }

  _createClass(Diagram, [{
    key: 'link_distance',
    value: function link_distance(distance) {
      if (typeof distance == 'function') return distance;else return function (cola) {
        return cola.linkDistance(distance);
      };
    }
  }, {
    key: 'init',
    value: function init() {
      for (var _len = arguments.length, meta = Array(_len), _key = 0; _key < _len; _key++) {
        meta[_key] = arguments[_key];
      }

      this.meta = meta;
      this.cola = this.init_cola();
      this.svg = this.init_svg();

      this.render();
    }
  }, {
    key: 'init_cola',
    value: function init_cola() {
      return cola.d3adaptor().avoidOverlaps(true).handleDisconnected(false).size([this.width, this.height]);
    }
  }, {
    key: 'init_svg',
    value: function init_svg() {
      var _this = this;

      var container = d3.select(this.selector).append('svg').attr('width', this.width).attr('height', this.height).append('g').call(d3.behavior.zoom().on('zoom', function () {
        return _this.zoom_callback(container);
      })).append('g');

      container.append('rect').attr('width', this.width * 10) // 10 is huge enough
      .attr('height', this.height * 10).attr('transform', 'translate(-' + this.width * 5 + ', -' + this.height * 5 + ')').style('opacity', 0);

      return container;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      this.display_load_message();

      d3.json(this.url, function (error, data) {
        if (error) console.error(error);

        var nodes = data.nodes.map(function (n, i) {
          return new _node2.default(n, i, _this2.meta, _this2.color);
        });
        var links = data.links.map(function (l, i) {
          return new _link2.default(l, i, _this2.meta);
        });
        var groups = _group2.default.divide(nodes, _this2.group_pattern, _this2.color);

        _this2.cola.nodes(nodes).links(links).groups(groups);
        _this2.set_distance(_this2.cola);
        _this2.cola.start();

        var group = _group2.default.render(_this2.svg, groups).call(_this2.cola.drag().on('dragstart', _this2.dragstart_callback));
        var link = _link2.default.render_links(_this2.svg, links);
        var node = _node2.default.render(_this2.svg, nodes).call(_this2.cola.drag().on('dragstart', _this2.dragstart_callback));

        var _Link$render_paths = _link2.default.render_paths(_this2.svg, links);

        var _Link$render_paths2 = _slicedToArray(_Link$render_paths, 2);

        var path = _Link$render_paths2[0];
        var label = _Link$render_paths2[1];

        // without path calculation

        _this2.configure_tick(group, node, link);
        _this2.ticks_forward();
        _this2.hide_load_message();

        // render path
        _this2.configure_tick(group, node, link, path, label);
        _this2.cola.start();
        _this2.ticks_forward(1);

        _this2.freeze(node);
      });
    }
  }, {
    key: 'configure_tick',
    value: function configure_tick(group, node, link, path, label) {
      this.cola.on('tick', function () {
        _node2.default.tick(node);
        _link2.default.tick(link, path, label);
        _group2.default.tick(group);
      });
    }
  }, {
    key: 'ticks_forward',
    value: function ticks_forward(count) {
      count = count || this.max_ticks;

      for (var i = 0; i < count; i++) {
        this.cola.tick();
      }this.cola.stop();
    }
  }, {
    key: 'freeze',
    value: function freeze(container) {
      container.each(function (d) {
        return d.fixed = true;
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      d3.select('body svg').remove();
    }
  }, {
    key: 'zoom_callback',
    value: function zoom_callback(container) {
      _link2.default.zoom(d3.event.scale);
      container.attr('transform', 'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')');
    }
  }, {
    key: 'dragstart_callback',
    value: function dragstart_callback() {
      d3.event.sourceEvent.stopPropagation();
    }
  }, {
    key: 'display_load_message',
    value: function display_load_message() {
      this.indicator = this.svg.append('text').attr('x', this.width / 2).attr('y', this.height / 2).attr('dy', '.35em').style('text-anchor', 'middle').text('Simulating. Just a moment ...');
    }
  }, {
    key: 'hide_load_message',
    value: function hide_load_message() {
      if (this.indicator) this.indicator.remove();
    }
  }]);

  return Diagram;
}();

module.exports = window.Diagram = Diagram;

},{"./group":2,"./link":3,"./node":5}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Group = function () {
  function Group(name, color) {
    _classCallCheck(this, Group);

    this.name = name;
    this.color = color;
    this.leaves = [];
  }

  _createClass(Group, [{
    key: 'push',
    value: function push(node) {
      this.leaves.push(node.id);
    }
  }, {
    key: 'transform',
    value: function transform() {
      return 'translate(' + this.bounds.x + ', ' + this.bounds.y + ')';
    }
  }, {
    key: 'group_width',
    value: function group_width() {
      return this.bounds.width();
    }
  }, {
    key: 'group_height',
    value: function group_height() {
      return this.bounds.height();
    }
  }], [{
    key: 'divide',
    value: function divide(nodes, pattern, color) {
      var groups = {};
      var register = function register(name, node, parent) {
        var key = parent + ':' + name;
        groups[key] = groups[key] || new Group(name, color);
        groups[key].push(node);
      };

      if (pattern) nodes.forEach(function (node) {
        var result = node.name.match(pattern);
        if (result) register(result[1] || result[0], node);

        node.group.forEach(function (name) {
          return register(name, node, result);
        });
      });

      return this.array(groups);
    }
  }, {
    key: 'array',
    value: function array(groups) {
      return Object.keys(groups).map(function (g) {
        return groups[g];
      });
    }
  }, {
    key: 'render',
    value: function render(svg, groups) {
      var group = svg.selectAll('.group').data(groups).enter().append('g').attr('class', 'group').attr('transform', function (d) {
        return d.transform();
      });

      group.append('rect').attr('rx', 8).attr('ry', 8).attr('width', function (d) {
        return d.group_width();
      }).attr('height', function (d) {
        return d.group_height();
      }).style('fill', function (d, i) {
        return d.color(i);
      });

      group.append('text').text(function (d) {
        return d.name;
      });

      return group;
    }
  }, {
    key: 'tick',
    value: function tick(group) {
      group.attr('transform', function (d) {
        return d.transform();
      });
      group.selectAll('rect').attr('width', function (d) {
        return d.group_width();
      }).attr('height', function (d) {
        return d.group_height();
      });
    }
  }]);

  return Group;
}();

module.exports = Group;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _meta_data = require('./meta_data');

var _meta_data2 = _interopRequireDefault(_meta_data);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Link = function () {
  function Link(data, id, meta_keys) {
    _classCallCheck(this, Link);

    this.id = id;
    this.source = _node2.default.id_by_name(data.source);
    this.target = _node2.default.id_by_name(data.target);
    this.source_meta = new _meta_data2.default(data.meta, 'source').slice(meta_keys);
    this.target_meta = new _meta_data2.default(data.meta, 'target').slice(meta_keys);

    this.label_x_offset = 20;
    this.label_y_offset = '1.1em';
  }

  _createClass(Link, [{
    key: 'is_reverse_path',
    value: function is_reverse_path() {
      return this.target_meta.length > 0;
    }
  }, {
    key: 'd',
    value: function d() {
      return 'M ' + this.source.x + ' ' + this.source.y + ' L ' + this.target.x + ' ' + this.target.y;
    }
  }, {
    key: 'path_id',
    value: function path_id() {
      return 'path' + this.id;
    }

    // OPTIMIZE: Implement better right-alignment of the path, especially for multi tspans

  }, {
    key: 'tspan_x_offset',
    value: function tspan_x_offset() {
      if (this.is_reverse_path()) return -this.label_x_offset;else return this.label_x_offset;
    }
  }, {
    key: 'rotate',
    value: function rotate(bbox) {
      if (this.source.x > this.target.x) return 'rotate(180 ' + (bbox.x + bbox.width / 2) + ' ' + (bbox.y + bbox.height / 2) + ')';else return 'rotate(0)';
    }
  }, {
    key: 'split',
    value: function split() {
      if (this.source_meta && this.target_meta) {
        var source = Object.assign(Object.create(this), this);
        var target = Object.assign(Object.create(this), this);
        source.target_meta = [];
        target.source_meta = [];
        return [source, target];
      }

      return [this];
    }
  }, {
    key: 'has_meta',
    value: function has_meta() {
      return this.source_meta.length > 0 || this.target_meta.length > 0;
    }
  }], [{
    key: 'render_links',
    value: function render_links(svg, links) {
      return svg.selectAll('.link').data(links).enter().append('line').attr('class', 'link').attr('x1', function (d) {
        return d.source.x;
      }).attr('y1', function (d) {
        return d.source.y;
      }).attr('x2', function (d) {
        return d.target.x;
      }).attr('y2', function (d) {
        return d.target.y;
      });
    }
  }, {
    key: 'render_paths',
    value: function render_paths(svg, links) {
      var labelled_links = links.filter(function (l) {
        return l.has_meta();
      });
      var paths = Link.create_paths(svg, labelled_links);

      var split_labelled_links = Array.prototype.concat.apply([], labelled_links.map(function (l) {
        return l.split();
      })).filter(function (l) {
        return l.has_meta();
      });
      var labels = this.create_labels(svg, split_labelled_links);

      Link.zoom(); // Initialize
      return [paths, labels];
    }
  }, {
    key: 'create_paths',
    value: function create_paths(svg, links) {
      return svg.selectAll('.path').data(links).enter().append('path').attr('d', function (d) {
        return d.d();
      }).attr('id', function (d) {
        return d.path_id();
      });
    }
  }, {
    key: 'create_labels',
    value: function create_labels(svg, links) {
      var text = svg.selectAll('.path-label').data(links).enter().append('text').attr('class', 'path-label').attr('pointer-events', 'none');
      var text_path = text.append('textPath').attr('xlink:href', function (d) {
        return '#' + d.path_id();
      });

      text_path.each(function (d) {
        Link.append_tspans(this, d.source_meta);
        Link.append_tspans(this, d.target_meta);

        if (d.is_reverse_path()) Link.the_other_end(this);
      });

      return text;
    }
  }, {
    key: 'the_other_end',
    value: function the_other_end(container) {
      d3.select(container).attr('class', 'reverse').attr('text-anchor', 'end').attr('startOffset', '100%');
    }
  }, {
    key: 'append_tspans',
    value: function append_tspans(container, meta) {
      meta.forEach(function (m, i) {
        d3.select(container).append('tspan').attr('x', function (d) {
          return d.tspan_x_offset();
        }).attr('dy', function (d) {
          return d.label_y_offset;
        }).attr('class', m.class).text(m.value);
      });
    }
  }, {
    key: 'tick',
    value: function tick(link, path, label) {
      link.attr('x1', function (d) {
        return d.source.x;
      }).attr('y1', function (d) {
        return d.source.y;
      }).attr('x2', function (d) {
        return d.target.x;
      }).attr('y2', function (d) {
        return d.target.y;
      });

      if (path) path.attr('d', function (d) {
        return d.d();
      });
      if (label) label.attr('transform', function (d) {
        return d.rotate(this.getBBox());
      });
    }
  }, {
    key: 'zoom',
    value: function zoom(scale) {
      var visibility = 'hidden';
      if (scale && scale > 1.5) visibility = 'visible';

      d3.selectAll('.path-label').style('visibility', visibility);
    }
  }]);

  return Link;
}();

module.exports = Link;

},{"./meta_data":4,"./node":5}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetaData = function () {
  function MetaData(data, extra_key) {
    _classCallCheck(this, MetaData);

    this.data = data;
    this.extra_key = extra_key;
  }

  _createClass(MetaData, [{
    key: "slice",
    value: function slice(keys) {
      if (!this.data) return [];

      if (this.extra_key) return this.slice_with_extra_key(keys);else return this.slice_without_extra_key(keys);
    }
  }, {
    key: "slice_with_extra_key",
    value: function slice_with_extra_key(keys) {
      var _this = this;

      var data = [];

      keys.forEach(function (k) {
        if (_this.data[k] && _this.data[k][_this.extra_key]) data.push({ class: k, value: _this.data[k][_this.extra_key] });
      });

      return data;
    }
  }, {
    key: "slice_without_extra_key",
    value: function slice_without_extra_key(keys) {
      var _this2 = this;

      var data = [];

      keys.forEach(function (k) {
        if (_this2.data[k]) data.push({ class: k, value: _this2.data[k] });
      });

      return data;
    }
  }]);

  return MetaData;
}();

module.exports = MetaData;

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _meta_data = require('./meta_data');

var _meta_data2 = _interopRequireDefault(_meta_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function () {
  function Node(data, id, meta_keys, color) {
    _classCallCheck(this, Node);

    this.id = id;
    this.name = data.name;
    this.group = typeof data.group == 'string' ? [data.group] : data.group || [];
    this.icon = data.icon;
    this.meta = new _meta_data2.default(data.meta).slice(meta_keys);
    this.color = color;

    this.width = 60;
    this.height = 40;
    this.padding = 3;
    this.tspan_offset = '1.1em';

    this.register(id, data.name);
  }

  _createClass(Node, [{
    key: 'register',
    value: function register(id, name) {
      Node.all = Node.all || {};
      Node.all[name] = id;
    }
  }, {
    key: 'transform',
    value: function transform() {
      var x = this.x - this.width / 2 + this.padding;
      var y = this.y - this.height / 2 + this.padding;
      return 'translate(' + x + ', ' + y + ')';
    }
  }, {
    key: 'node_width',
    value: function node_width() {
      return this.width - 2 * this.padding;
    }
  }, {
    key: 'node_height',
    value: function node_height() {
      return this.height - 2 * this.padding;
    }
  }, {
    key: 'x_for_text',
    value: function x_for_text() {
      return this.width / 2;
    }
  }, {
    key: 'y_for_text',
    value: function y_for_text() {
      return this.height / 2;
    }
  }], [{
    key: 'id_by_name',
    value: function id_by_name(name) {
      if (Node.all[name] == undefined) throw 'Unknown node "' + name + '"';
      return Node.all[name];
    }
  }, {
    key: 'render',
    value: function render(svg, nodes) {
      var container = svg.selectAll('.node').data(nodes).enter().append('g').attr('transform', function (d) {
        return d.transform();
      });

      container.each(function (d) {
        if (d.icon) Node.append_image(this);else Node.append_rect(this);

        Node.append_text(this);
      });

      return container;
    }
  }, {
    key: 'append_text',
    value: function append_text(container) {
      var text = d3.select(container).append('text').attr('text-anchor', 'middle').attr('x', function (d) {
        return d.x_for_text();
      }).attr('y', function (d) {
        return d.y_for_text();
      });
      text.append('tspan').text(function (d) {
        return d.name;
      }).attr('x', function (d) {
        return d.x_for_text();
      });

      text.each(function (d) {
        Node.append_tspans(text, d.meta);
      });
    }
  }, {
    key: 'append_tspans',
    value: function append_tspans(container, meta) {
      meta.forEach(function (m) {
        container.append('tspan').attr('x', function (d) {
          return d.x_for_text();
        }).attr('dy', function (d) {
          return d.tspan_offset;
        }).attr('class', m.class).text(m.value);
      });
    }
  }, {
    key: 'append_image',
    value: function append_image(container) {
      d3.select(container).attr('class', 'node image').append('image').attr('xlink:href', function (d) {
        return d.icon;
      }).attr('width', function (d) {
        return d.node_width();
      }).attr('height', function (d) {
        return d.node_height();
      });
    }
  }, {
    key: 'append_rect',
    value: function append_rect(container) {
      d3.select(container).attr('class', 'node rect').append('rect').attr('width', function (d) {
        return d.node_width();
      }).attr('height', function (d) {
        return d.node_height();
      }).attr('rx', 5).attr('ry', 5).style('fill', function (d) {
        return d.color();
      });
    }
  }, {
    key: 'tick',
    value: function tick(container) {
      container.attr('transform', function (d) {
        return d.transform();
      });
    }
  }]);

  return Node;
}();

module.exports = Node;

},{"./meta_data":4}]},{},[1,2,3,4,5]);
