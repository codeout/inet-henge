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

/***/ "./src/link.ts":
/*!*********************!*\
  !*** ./src/link.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Link": () => (/* binding */ Link),
/* harmony export */   "LinkBase": () => (/* binding */ LinkBase)
/* harmony export */ });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _meta_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./meta_data */ "./src/meta_data.ts");
/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node */ "./src/node.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./src/util.ts");




class LinkBase {
    constructor(data, id, metaKeys, linkWidth) {
        this.id = id;
        this.source = _node__WEBPACK_IMPORTED_MODULE_2__.Node.idByName(data.source);
        this.target = _node__WEBPACK_IMPORTED_MODULE_2__.Node.idByName(data.target);
        this.metaList = new _meta_data__WEBPACK_IMPORTED_MODULE_1__.MetaData(data.meta).get(metaKeys);
        this.sourceMeta = new _meta_data__WEBPACK_IMPORTED_MODULE_1__.MetaData(data.meta, "source").get(metaKeys);
        this.targetMeta = new _meta_data__WEBPACK_IMPORTED_MODULE_1__.MetaData(data.meta, "target").get(metaKeys);
        this.extraClass = data.class || "";
        if (typeof linkWidth === "function")
            this.width = linkWidth(data.meta) || 3;
        else
            this.width = linkWidth || 3;
        this.defaultMargin = 15;
        this.labelXOffset = 20;
        this.labelYOffset = 1.5; // em
        this.color = "#7a4e4e";
        this.register(id, this.source, this.target);
    }
    isNamedPath() {
        return this.metaList.length > 0;
    }
    isReversePath() {
        return this.targetMeta.length > 0;
    }
    d() {
        return `M ${this.source.x} ${this.source.y} L ${this.target.x} ${this.target.y}`;
    }
    pathId() {
        return `path${this.id}`;
    }
    linkId() {
        return `link${this.id}`;
    }
    margin() {
        if (!this._margin) {
            const margin = window.getComputedStyle(document.getElementById(this.linkId())).margin;
            // NOTE: Assuming that window.getComputedStyle() returns some value link "10px"
            // or "0px" even when not defined in .css
            if (!margin || margin === "0px") {
                this._margin = this.defaultMargin;
            }
            else {
                this._margin = parseInt(margin);
            }
        }
        return this._margin;
    }
    // OPTIMIZE: Implement better right-alignment of the path, especially for multi tspans
    tspanXOffset() {
        if (this.isNamedPath())
            return 0;
        else if (this.isReversePath())
            return -this.labelXOffset;
        else
            return this.labelXOffset;
    }
    tspanYOffset() {
        if (this.isNamedPath())
            return `${-this.labelYOffset + 0.7}em`;
        else
            return `${this.labelYOffset}em`;
    }
    rotate(bbox) {
        if (this.source.x > this.target.x)
            return `rotate(180 ${bbox.x + bbox.width / 2} ${bbox.y + bbox.height / 2})`;
        else
            return "rotate(0)";
    }
    split() {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!this.metaList && !this.sourceMeta && !this.targetMeta)
            return [this];
        const meta = [];
        ["metaList", "sourceMeta", "targetMeta"].forEach((key, i, keys) => {
            if (this[key]) {
                const duped = Object.assign(Object.create(this), this);
                keys.filter((k) => k !== key).forEach((k) => (duped[k] = []));
                meta.push(duped);
            }
        });
        return meta;
    }
    hasMeta() {
        return this.metaList.length > 0 || this.sourceMeta.length > 0 || this.targetMeta.length > 0;
    }
    class() {
        // eslint-disable-next-line max-len
        return `link ${(0,_util__WEBPACK_IMPORTED_MODULE_3__.classify)(this.source.name)} ${(0,_util__WEBPACK_IMPORTED_MODULE_3__.classify)(this.target.name)} ${(0,_util__WEBPACK_IMPORTED_MODULE_3__.classify)(this.source.name)}-${(0,_util__WEBPACK_IMPORTED_MODULE_3__.classify)(this.target.name)} ${this.extraClass}`;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static render(linkLayer, labelLayer, links) {
        // Render lines
        const pathGroup = linkLayer
            .selectAll(".link")
            .data(links)
            .enter()
            .append("g")
            .attr("class", (d) => d.class());
        const link = pathGroup
            .append("line")
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y)
            .attr("stroke", (d) => d.color)
            .attr("stroke-width", (d) => d.width)
            .attr("id", (d) => d.linkId())
            .on("mouseover.line", (d) => textGroup.selectAll(`text.${d.pathId()}`).classed("hover", true))
            .on("mouseout.line", (d) => textGroup.selectAll(`text.${d.pathId()}`).classed("hover", false));
        const path = pathGroup
            .append("path")
            .attr("d", (d) => d.d())
            .attr("id", (d) => d.pathId());
        // Render texts
        const textGroup = labelLayer
            .selectAll(".link")
            .data(links)
            .enter()
            .append("g")
            .attr("class", (d) => d.class());
        const text = textGroup
            .selectAll("text")
            .data((d) => d.split().filter((l) => l.hasMeta()))
            .enter()
            .append("text")
            .attr("class", (d) => d.pathId()); // Bind text with pathId as class
        const textPath = text.append("textPath").attr("xlink:href", (d) => `#${d.pathId()}`);
        textPath.each(function (d) {
            Link.appendTspans(this, d.metaList);
            Link.appendTspans(this, d.sourceMeta);
            Link.appendTspans(this, d.targetMeta);
            if (d.isNamedPath())
                Link.center(this);
            if (d.isReversePath())
                Link.theOtherEnd(this);
        });
        Link.zoom(); // Initialize
        return [link, path, text];
    }
    static theOtherEnd(container) {
        d3__WEBPACK_IMPORTED_MODULE_0__.select(container).attr("class", "reverse").attr("text-anchor", "end").attr("startOffset", "100%");
    }
    static center(container) {
        d3__WEBPACK_IMPORTED_MODULE_0__.select(container).attr("class", "center").attr("text-anchor", "middle").attr("startOffset", "50%");
    }
    static appendTspans(container, meta) {
        meta.forEach((m) => {
            d3__WEBPACK_IMPORTED_MODULE_0__.select(container)
                .append("tspan")
                .attr("x", (d) => d.tspanXOffset())
                .attr("dy", (d) => d.tspanYOffset())
                .attr("class", m.class)
                .text(m.value);
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static tick(link, path, label) {
        link
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);
        if (path)
            path.attr("d", (d) => d.d());
        if (label)
            label.attr("transform", function (d) {
                return d.rotate(this.getBBox());
            });
    }
    static zoom(scale) {
        let visibility = "hidden";
        if (scale && scale > 1.5)
            visibility = "visible";
        d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(".link text").style("visibility", visibility);
    }
    static setPosition(link, position) {
        link
            .attr("x1", (d, i) => position[i].x1)
            .attr("y1", (d, i) => position[i].y1)
            .attr("x2", (d, i) => position[i].x2)
            .attr("y2", (d, i) => position[i].y2);
    }
    register(id, source, target) {
        Link.groups = Link.groups || {};
        const key = [source, target].sort().toString();
        Link.groups[key] = Link.groups[key] || [];
        Link.groups[key].push(id);
    }
    static shiftMultiplier(link) {
        const members = Link.groups[[link.source.id, link.target.id].sort().toString()] || [];
        return members.indexOf(link.id) - (members.length - 1) / 2;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static shiftBundle(link, path, label) {
        const transform = (d) => d.shiftBundle(Link.shiftMultiplier(d));
        link.attr("transform", transform);
        path.attr("transform", transform);
        label.attr("transform", transform);
    }
    shiftBundle(multiplier) {
        const gap = this.margin() * multiplier;
        const width = Math.abs(this.target.x - this.source.x);
        const height = Math.abs(this.source.y - this.target.y);
        const length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        return `translate(${(gap * height) / length}, ${(gap * width) / length})`;
    }
    static reset() {
        Link.groups = null;
    }
}
const Eventable = (Base) => {
    class EventableLink extends Base {
        constructor(data, id, metaKeys, linkWidth) {
            super(data, id, metaKeys, linkWidth);
            this.dispatch = d3__WEBPACK_IMPORTED_MODULE_0__.dispatch("rendered");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        static render(linkLayer, labelLayer, links) {
            const [link, path, text] = super.render(linkLayer, labelLayer, links);
            link.each(function (d) {
                d.dispatch.rendered(this);
            });
            return [link, path, text];
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(name, callback) {
            this.dispatch.on(name, callback);
        }
    }
    return EventableLink;
};
const Pluggable = (Base) => {
    class Link extends Base {
        constructor(data, id, metaKeys, linkWidth) {
            super(data, id, metaKeys, linkWidth);
            for (const constructor of Link.pluginConstructors) {
                // Call Pluggable at last as constructor may call methods defined in other classes
                constructor.bind(this)(data, id, metaKeys, linkWidth);
            }
        }
        static registerConstructor(func) {
            Link.pluginConstructors.push(func);
        }
    }
    Link.pluginConstructors = [];
    return Link;
};
class EventableLink extends Eventable(LinkBase) {
}
// Call Pluggable at last as constructor may call methods defined in other classes
class Link extends Pluggable(EventableLink) {
}



/***/ }),

/***/ "./src/meta_data.ts":
/*!**************************!*\
  !*** ./src/meta_data.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MetaData": () => (/* binding */ MetaData)
/* harmony export */ });
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Node": () => (/* binding */ Node)
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
        const node = layer
            .selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("id", (d) => (0,_util__WEBPACK_IMPORTED_MODULE_2__.classify)(d.name))
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
                Node.appendTspans(text, d.metaList);
            }
        });
    }
    static appendTspans(container, meta) {
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
            .style("fill", (d) => d.options.color());
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
/* harmony export */   "classify": () => (/* binding */ classify)
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************************!*\
  !*** ./plugins/arrows_link/src/plugin.ts ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArrowsLinkPlugin": () => (/* binding */ ArrowsLinkPlugin),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../src/link */ "./src/link.ts");
var _a;


class ArrowsLink extends _src_link__WEBPACK_IMPORTED_MODULE_1__.Link {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static tick(link, path, label) {
        super.tick(link, path, label);
        link.attr("x2", (d) => d.x2());
        link.attr("y2", (d) => d.y2());
    }
    length() {
        return Math.sqrt((this.source.x - this.target.x) ** 2 +
            (this.source.y - this.target.y) ** 2);
    }
    x2() {
        return this.source.x + (0.5 - 5 / this.length()) * (this.target.x - this.source.x);
    }
    y2() {
        return this.source.y + (0.5 - 5 / this.length()) * (this.target.y - this.source.y);
    }
}
const ArrowsLinkPlugin = (_a = class ArrowsLinkPlugin {
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        static load(Group, Node, Link) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
            Link.registerConstructor(function (data, id, metaKeys, linkWidth) {
                this.selected = false;
                this.on("rendered", (element) => {
                    ArrowsLinkPlugin.appendMarker(element);
                    if (!ArrowsLinkPlugin.isMarkerDefined) {
                        ArrowsLinkPlugin.defineMarkers();
                    }
                });
            });
            // Copy methods
            Link.tick = ArrowsLink.tick;
            Link.prototype.length = ArrowsLink.prototype.length;
            Link.prototype.x2 = ArrowsLink.prototype.x2;
            Link.prototype.y2 = ArrowsLink.prototype.y2;
        }
        static defineMarkers() {
            const defs = d3__WEBPACK_IMPORTED_MODULE_0__.select("svg").append("defs");
            const define = (id) => {
                defs
                    .append("marker")
                    .attr("id", id)
                    .attr("markerWidth", 10)
                    .attr("markerHeight", 7)
                    .attr("refX", 7.5)
                    .attr("orient", "auto")
                    .attr("viewBox", "0 -5 10 10")
                    .append("path")
                    .attr("d", "M0,-5 L10,0 L0,5");
            };
            define("marker-odd");
            define("marker-even");
            ArrowsLinkPlugin.isMarkerDefined = true;
        }
        static appendMarker(element) {
            d3__WEBPACK_IMPORTED_MODULE_0__.select(element).attr("marker-end", 
            // For consistency with #links :nth-child(odd), it's one-based
            (d) => (d.id % 2 === 0 ? "url(#marker-odd)" : "url(#marker-even)"));
        }
    },
    _a.isMarkerDefined = false,
    _a);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ArrowsLinkPlugin);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=plugin.js.map