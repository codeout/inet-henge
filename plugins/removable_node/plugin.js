(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"));
	else if(typeof define === 'function' && define.amd)
		define(["d3"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("d3")) : factory(root["d3"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, (__WEBPACK_EXTERNAL_MODULE_d3__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/meta_data.ts":
/*!**************************!*\
  !*** ./src/meta_data.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MetaData: () => (/* binding */ MetaData)
/* harmony export */ });
class MetaData {
    constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data, extraKey) {
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Node: () => (/* binding */ Node)
/* harmony export */ });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _meta_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./meta_data */ "./src/meta_data.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/util.ts");



class NodeBase {
    constructor(data, id, options) {
        this.id = id;
        this.options = options;
        this.name = data.name;
        this.group = typeof data.group === "string" ? [data.group] : data.group || [];
        this.icon = data.icon;
        this.metaList = new _meta_data__WEBPACK_IMPORTED_MODULE_1__.MetaData(data.meta).get(options.metaKeys);
        this.meta = data.meta;
        this.extraClass = data.class || "";
        this.width = options.width || 60;
        this.height = options.height || 40;
        this.padding = 3;
        this.tspanOffset = "1.1em";
        this.register(id);
    }
    register(id) {
        Node.all = Node.all || {};
        Node.all[this.name] = id;
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
        return this.nodeWidth() / 2;
    }
    yForText() {
        // svg ignores padding for some reason
        return this.height / 2;
    }
    static idByName(name) {
        if (Node.all[name] === undefined)
            throw `Unknown node "${name}"`;
        return Node.all[name];
    }
    nodeId() {
        return (0,_util__WEBPACK_IMPORTED_MODULE_2__.classify)(this.name);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static render(layer, nodes) {
        const node = layer
            .selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("id", (d) => d.nodeId())
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
        const text = d3__WEBPACK_IMPORTED_MODULE_0__.select(container)
            .append("text")
            .attr("text-anchor", "middle")
            .attr("x", (d) => d.xForText())
            .attr("y", (d) => d.yForText());
        text
            .append("tspan")
            .text((d) => d.name)
            .attr("x", (d) => d.xForText());
        text.each((d) => {
            // Show meta only when "tooltip" option is not configured
            if (!d.options.tooltip) {
                Node.appendMetaText(text, d.metaList);
            }
        });
    }
    static appendMetaText(container, meta) {
        meta.forEach((m) => {
            container
                .append("tspan")
                .attr("x", (d) => d.xForText())
                .attr("dy", (d) => d.tspanOffset)
                .attr("class", m.class)
                .text(m.value);
        });
    }
    static appendImage(container) {
        d3__WEBPACK_IMPORTED_MODULE_0__.select(container)
            .attr("class", (d) => `node image ${(0,_util__WEBPACK_IMPORTED_MODULE_2__.classify)(d.name)} ${d.extraClass}`)
            .append("image")
            .attr("xlink:href", (d) => d.icon)
            .attr("width", (d) => d.nodeWidth())
            .attr("height", (d) => d.nodeHeight());
    }
    static appendRect(container) {
        d3__WEBPACK_IMPORTED_MODULE_0__.select(container)
            .attr("class", (d) => `node rect ${(0,_util__WEBPACK_IMPORTED_MODULE_2__.classify)(d.name)} ${d.extraClass}`)
            .append("rect")
            .attr("width", (d) => d.nodeWidth())
            .attr("height", (d) => d.nodeHeight())
            .attr("rx", 5)
            .attr("ry", 5)
            .style("fill", (d) => d.options.color(undefined));
    }
    static tick(node) {
        node.attr("transform", (d) => d.transform());
    }
    static setPosition(node, position) {
        node.attr("transform", (d, i) => {
            var _a, _b, _c, _d;
            if (((_a = position[i]) === null || _a === void 0 ? void 0 : _a.x) !== null &&
                ((_b = position[i]) === null || _b === void 0 ? void 0 : _b.x) !== undefined &&
                ((_c = position[i]) === null || _c === void 0 ? void 0 : _c.y) !== null &&
                ((_d = position[i]) === null || _d === void 0 ? void 0 : _d.y) !== undefined) {
                d.x = position[i].x;
                d.y = position[i].y;
            }
            return d.transform();
        });
    }
    static reset() {
        Node.all = null;
    }
}
const Eventable = (Base) => {
    class EventableNode extends Base {
        constructor(data, id, options) {
            super(data, id, options);
            this.dispatch = d3__WEBPACK_IMPORTED_MODULE_0__.dispatch("rendered");
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
        constructor(data, id, options) {
            super(data, id, options);
            for (const constructor of Node.pluginConstructors) {
                // Call Pluggable at last as constructor may call methods defined in other classes
                constructor.bind(this)(data, id, options);
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   classify: () => (/* binding */ classify)
/* harmony export */ });
function classify(string) {
    return string.replace(" ", "-").toLowerCase();
}


/***/ }),

/***/ "d3":
/*!*********************!*\
  !*** external "d3" ***!
  \*********************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_d3__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************************************!*\
  !*** ./plugins/removable_node/src/plugin.ts ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemovableNodePlugin: () => (/* binding */ RemovableNodePlugin),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_node__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../src/node */ "./src/node.ts");
/* harmony import */ var _src_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../src/util */ "./src/util.ts");
var _a;



class RemovableNode extends _src_node__WEBPACK_IMPORTED_MODULE_1__.Node {
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
        static load(Group, Node, Link, options = {}) {
            if (options.showKey) {
                _a.showKey = options.showKey;
            }
            if (options.hideKey) {
                _a.hideKey = options.hideKey;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Node.registerConstructor(function (data, id, options) {
                this.selected = false;
                this.on("rendered", (element) => {
                    _a.configureRemovableNode(element);
                });
            });
            _a.configureRemovableNodes();
            // Copy methods
            Node.prototype.toggleSelected = RemovableNode.prototype.toggleSelected;
            Node.prototype.reset = RemovableNode.prototype.reset;
            Node.prototype.textColor = RemovableNode.prototype.textColor;
        }
        /**
         * Configure keyboard event listener to show or hide Nodes and Links
         */
        static configureRemovableNodes() {
            d3__WEBPACK_IMPORTED_MODULE_0__.select("body").on("keydown", () => {
                switch (d3__WEBPACK_IMPORTED_MODULE_0__.event.key) {
                    case _a.showKey:
                        _a.show();
                        break;
                    case _a.hideKey:
                        _a.hide();
                }
            });
        }
        /**
         * Configure click event listener to select Nodes
         */
        static configureRemovableNode(element) {
            const d3Element = d3__WEBPACK_IMPORTED_MODULE_0__.select(element);
            d3Element.on("click.removableNode", function (d) {
                // Do nothing for dragging
                if (d3__WEBPACK_IMPORTED_MODULE_0__.event.defaultPrevented) {
                    return;
                }
                d.toggleSelected();
                _a.applyColor(this);
            });
        }
        static applyColor(element) {
            d3__WEBPACK_IMPORTED_MODULE_0__.select(element)
                .select("text tspan")
                .style("fill", (d) => d.textColor());
        }
        static show() {
            d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(".node")
                .style("display", "inline")
                .each(function (d) {
                d.reset();
                _a.applyColor(this);
            });
            _a.showLinks();
        }
        static hide() {
            d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(".node").style("display", (d) => {
                if (d.selected) {
                    // Hide connected elements
                    _a.hideLinks(d.name);
                    _a.hideToolTips(d.name);
                    return "none";
                }
                return "inline";
            });
        }
        static showLinks() {
            d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(`.link`).style("display", "inline");
        }
        static hideLinks(nodeName) {
            d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(`.link.${(0,_src_util__WEBPACK_IMPORTED_MODULE_2__.classify)(nodeName)}`).style("display", "none");
        }
        static hideToolTips(nodeName) {
            d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(`.tooltip.${(0,_src_util__WEBPACK_IMPORTED_MODULE_2__.classify)(nodeName)}`).attr("visibility", "hidden");
        }
    },
    _a.showKey = "Escape",
    _a.hideKey = "d",
    _a);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RemovableNodePlugin);

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=plugin.js.map