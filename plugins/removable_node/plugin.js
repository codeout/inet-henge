(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"));
	else if(typeof define === 'function' && define.amd)
		define(["d3"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("d3")) : factory(root["d3"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function(__WEBPACK_EXTERNAL_MODULE_d3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./plugins/removable_node/src/plugin.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./plugins/removable_node/src/plugin.ts":
/*!**********************************************!*\
  !*** ./plugins/removable_node/src/plugin.ts ***!
  \**********************************************/
/*! exports provided: RemovableNodePlugin, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RemovableNodePlugin", function() { return RemovableNodePlugin; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_node__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../src/node */ "./src/node.ts");
/* harmony import */ var _src_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../src/util */ "./src/util.ts");
var _a;



class RemovableNode extends _src_node__WEBPACK_IMPORTED_MODULE_1__["Node"] {
    toggleSelected() {
        this.selected = !this.selected;
    }
    reset() {
        this.selected = false;
    }
    textColor() {
        return this.selected ? "red" : "black";
    }
}
const RemovableNodePlugin = (_a = class RemovableNodePlugin {
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        static load(Group, Node, Link, options = {}) {
            if (options.showKey) {
                RemovableNodePlugin.showKey = options.showKey;
            }
            if (options.hideKey) {
                RemovableNodePlugin.hideKey = options.hideKey;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
            Node.registerConstructor(function (data, id, metaKeys, color, tooltip) {
                this.selected = false;
                this.on("rendered", (element) => {
                    RemovableNodePlugin.configureRemovableNode(element);
                });
            });
            RemovableNodePlugin.configureRemovableNodes();
            // Copy methods
            Node.prototype.toggleSelected = RemovableNode.prototype.toggleSelected;
            Node.prototype.reset = RemovableNode.prototype.reset;
            Node.prototype.textColor = RemovableNode.prototype.textColor;
        }
        /**
         * Configure keyboard event listener to show or hide Nodes and Links
         */
        static configureRemovableNodes() {
            d3__WEBPACK_IMPORTED_MODULE_0__["select"]("body").on("keydown", () => {
                switch (d3__WEBPACK_IMPORTED_MODULE_0__["event"].key) {
                    case RemovableNodePlugin.showKey:
                        RemovableNodePlugin.show();
                        break;
                    case RemovableNodePlugin.hideKey:
                        RemovableNodePlugin.hide();
                }
            });
        }
        /**
         * Configure click event listener to select Nodes
         */
        static configureRemovableNode(element) {
            const d3Element = d3__WEBPACK_IMPORTED_MODULE_0__["select"](element);
            d3Element.on("click.removableNode", function (d) {
                // Do nothing for dragging
                if (d3__WEBPACK_IMPORTED_MODULE_0__["event"].defaultPrevented) {
                    return;
                }
                d.toggleSelected();
                RemovableNodePlugin.applyColor(this);
            });
        }
        static applyColor(element) {
            d3__WEBPACK_IMPORTED_MODULE_0__["select"](element).select("text tspan").style("fill", (d) => d.textColor());
        }
        static show() {
            d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"](".node")
                .style("display", "inline")
                .each(function (d) {
                d.reset();
                RemovableNodePlugin.applyColor(this);
            });
            RemovableNodePlugin.showLinks();
        }
        static hide() {
            d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"](".node")
                .style("display", (d) => {
                if (d.selected) {
                    // Hide connected elements
                    RemovableNodePlugin.hideLinks(d.name);
                    RemovableNodePlugin.hideToolTips(d.name);
                    return "none";
                }
                return "inline";
            });
        }
        static showLinks() {
            d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"](`.link`)
                .style("display", "inline");
        }
        static hideLinks(nodeName) {
            d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"](`.link.${Object(_src_util__WEBPACK_IMPORTED_MODULE_2__["classify"])(nodeName)}`)
                .style("display", "none");
        }
        static hideToolTips(nodeName) {
            d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"](`.tooltip.${Object(_src_util__WEBPACK_IMPORTED_MODULE_2__["classify"])(nodeName)}`)
                .attr("visibility", "hidden");
        }
    },
    _a.showKey = "Escape",
    _a.hideKey = "d",
    _a);
/* harmony default export */ __webpack_exports__["default"] = (RemovableNodePlugin);


/***/ }),

/***/ "./src/meta_data.ts":
/*!**************************!*\
  !*** ./src/meta_data.ts ***!
  \**************************/
/*! exports provided: MetaData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MetaData", function() { return MetaData; });
class MetaData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data, extraKey) {
        this.data = data;
        this.extraKey = extraKey;
    }
    get(keys) {
        return this.slice(keys).filter((k) => typeof k.value === "string");
    }
    slice(keys) {
        if (!this.data)
            return [];
        if (this.extraKey)
            return this.sliceWithExtraKey(keys);
        else
            return this.sliceWithoutExtraKey(keys);
    }
    sliceWithExtraKey(keys) {
        const data = [];
        keys.forEach((k) => {
            if (this.data[k] && this.data[k][this.extraKey])
                data.push({ class: k, value: this.data[k][this.extraKey] });
        });
        return data;
    }
    sliceWithoutExtraKey(keys) {
        const data = [];
        keys.forEach((k) => {
            if (this.data[k])
                data.push({ class: k, value: this.data[k] });
        });
        return data;
    }
}


/***/ }),

/***/ "./src/node.ts":
/*!*********************!*\
  !*** ./src/node.ts ***!
  \*********************/
/*! exports provided: Node */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Node", function() { return Node; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _meta_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./meta_data */ "./src/meta_data.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/util.ts");



class NodeBase {
    // Fix @types/d3/index.d.ts. Should be "d3.scale.Ordinal<number, string>" but "d3.scale.Ordinal<string, string>" somehow
    // Also, it should have accepted undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data, id, metaKeys, color, tooltip) {
        this.id = id;
        this.color = color;
        this.tooltip = tooltip;
        this.name = data.name;
        this.group = typeof data.group === "string" ? [data.group] : (data.group || []);
        this.icon = data.icon;
        this.meta = new _meta_data__WEBPACK_IMPORTED_MODULE_1__["MetaData"](data.meta).get(metaKeys);
        this.extraClass = data.class || "";
        this.width = 60;
        this.height = 40;
        this.padding = 3;
        this.tspanOffset = "1.1em";
        this.register(id, data.name);
    }
    register(id, name) {
        Node.all = Node.all || {};
        Node.all[name] = id;
    }
    transform() {
        const x = this.x - this.width / 2 + this.padding;
        const y = this.y - this.height / 2 + this.padding;
        return `translate(${x}, ${y})`;
    }
    nodeWidth() {
        return this.width - 2 * this.padding;
    }
    nodeHeight() {
        return this.height - 2 * this.padding;
    }
    xForText() {
        return this.width / 2;
    }
    yForText() {
        return this.height / 2;
    }
    static idByName(name) {
        if (Node.all[name] === undefined)
            throw `Unknown node "${name}"`;
        return Node.all[name];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static render(layer, nodes) {
        const node = layer.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("id", (d) => Object(_util__WEBPACK_IMPORTED_MODULE_2__["classify"])(d.name))
            .attr("name", (d) => d.name)
            .attr("transform", (d) => d.transform());
        node.each(function (d) {
            if (d.icon)
                Node.appendImage(this);
            else
                Node.appendRect(this);
            Node.appendText(this);
        });
        return node;
    }
    static appendText(container) {
        const text = d3__WEBPACK_IMPORTED_MODULE_0__["select"](container).append("text")
            .attr("text-anchor", "middle")
            .attr("x", (d) => d.xForText())
            .attr("y", (d) => d.yForText());
        text.append("tspan")
            .text((d) => d.name)
            .attr("x", (d) => d.xForText());
        text.each((d) => {
            // Show meta only when "tooltip" option is not configured
            if (!d.tooltip) {
                Node.appendTspans(text, d.meta);
            }
        });
    }
    static appendTspans(container, meta) {
        meta.forEach((m) => {
            container.append("tspan")
                .attr("x", (d) => d.xForText())
                .attr("dy", (d) => d.tspanOffset)
                .attr("class", m.class)
                .text(m.value);
        });
    }
    static appendImage(container) {
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](container)
            .attr("class", (d) => `node image ${Object(_util__WEBPACK_IMPORTED_MODULE_2__["classify"])(d.name)} ${d.extraClass}`)
            .append("image")
            .attr("xlink:href", (d) => d.icon)
            .attr("width", (d) => d.nodeWidth())
            .attr("height", (d) => d.nodeHeight());
    }
    static appendRect(container) {
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](container)
            .attr("class", (d) => `node rect ${Object(_util__WEBPACK_IMPORTED_MODULE_2__["classify"])(d.name)} ${d.extraClass}`)
            .append("rect")
            .attr("width", (d) => d.nodeWidth())
            .attr("height", (d) => d.nodeHeight())
            .attr("rx", 5)
            .attr("ry", 5)
            .style("fill", (d) => d.color());
    }
    static tick(node) {
        node.attr("transform", (d) => d.transform());
    }
    static setPosition(node, position) {
        node.attr("transform", (d, i) => {
            d.x = position[i].x;
            d.y = position[i].y;
            return d.transform();
        });
    }
    static reset() {
        Node.all = null;
    }
}
const Eventable = (Base) => {
    class EventableNode extends Base {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(data, id, metaKeys, color, tooltip) {
            super(data, id, metaKeys, color, tooltip);
            this.dispatch = d3__WEBPACK_IMPORTED_MODULE_0__["dispatch"]("rendered");
        }
        static render(layer, nodes) {
            const node = super.render(layer, nodes);
            node.each(function (d) {
                d.dispatch.rendered(this);
            });
            return node;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(name, callback) {
            this.dispatch.on(name, callback);
        }
    }
    return EventableNode;
};
const Pluggable = (Base) => {
    class Node extends Base {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(data, id, metaKeys, color, tooltip) {
            super(data, id, metaKeys, color, tooltip);
            for (const constructor of Node.pluginConstructors) {
                // Call Pluggable at last as constructor may call methods defined in other classes
                constructor.bind(this)(data, id, metaKeys, color, tooltip);
            }
        }
        static registerConstructor(func) {
            Node.pluginConstructors.push(func);
        }
    }
    Node.pluginConstructors = [];
    return Node;
};
class EventableNode extends Eventable(NodeBase) {
}
// Call Pluggable at last as constructor may call methods defined in other classes
class Node extends Pluggable(EventableNode) {
}



/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/*! exports provided: classify */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "classify", function() { return classify; });
function classify(string) {
    return string.replace(" ", "-").toLowerCase();
}


/***/ }),

/***/ "d3":
/*!*********************!*\
  !*** external "d3" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_d3__;

/***/ })

/******/ });
});
//# sourceMappingURL=plugin.js.map