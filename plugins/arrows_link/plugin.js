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

/***/ "./src/bundle.ts":
/*!***********************!*\
  !*** ./src/bundle.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bundle: () => (/* binding */ Bundle)
/* harmony export */ });
class Bundle {
    constructor(links, id) {
        this.id = id;
        this.links = links;
        this.color = "#7a4e4e";
        this.width = 2;
        this.space = 4;
    }
    static divide(links) {
        Bundle.groups = {};
        for (const l of links) {
            if (l.bundle) {
                const key = this.groupKey(l);
                (Bundle.groups[key] || (Bundle.groups[key] = [])).push(l.id);
            }
        }
        return Object.values(Bundle.groups).map((ids, i) => {
            return new Bundle(ids.map((id) => links[id]), i);
        });
    }
    static groupKey(link) {
        return JSON.stringify([link.source, link.target, link.bundle]);
    }
    static render(linkLayer, // eslint-disable-line @typescript-eslint/no-explicit-any
    bundles) {
        const bundleGroup = linkLayer
            .selectAll(".bundle")
            .data(bundles)
            .enter()
            .append("g")
            .attr("class", (d) => d.class());
        const bundle = bundleGroup
            .append("path")
            .attr("d", (d) => d.d())
            .attr("stroke", (d) => d.color)
            .attr("stroke-width", (d) => d.width)
            .attr("fill", "none")
            .attr("id", (d) => d.bundleId());
        return bundle;
    }
    static reset() {
        Bundle.groups = null;
    }
    // sort by bundle with preserving order
    static sortByBundle(links) {
        return links.sort((a, b) => {
            switch (true) {
                case !!a.bundle && !b.bundle:
                    return -1;
                case !a.bundle && !!b.bundle:
                    return 1;
                case !a.bundle && !b.bundle:
                    return 0;
                // !!a.bundle && !!b.bundle === true
                case a.bundle.toString() < b.bundle.toString():
                    return -1;
                case a.bundle.toString() > b.bundle.toString():
                    return 1;
                default:
                    return 0;
            }
        });
    }
    d() {
        const first = this.links[0].centerCoordinates();
        const last = this.links[this.links.length - 1].centerCoordinates();
        const gap = Math.sqrt(Math.pow(first[0] - last[0], 2) + Math.pow(first[1] - last[1], 2));
        if (gap === 0) {
            return "";
        }
        const angle = this.links[0].angle() + 90;
        const start = [
            ((first[0] - last[0]) * this.space) / gap + first[0],
            ((first[1] - last[1]) * this.space) / gap + first[1],
        ];
        const end = [
            ((last[0] - first[0]) * this.space) / gap + last[0],
            ((last[1] - first[1]) * this.space) / gap + last[1],
        ];
        return `M ${start[0]} ${start[1]} A ${gap / 2 + 10},5 ${angle} 1,0 ${end[0]} ${end[1]}`;
    }
    shiftMultiplier() {
        if (!this._shiftMultiplier) {
            const members = this.links[0].group() || [];
            this._shiftMultiplier = this.links.reduce((sum, l) => (sum += l.id - (members.length - 1) / 2), 0) / 2;
        }
        return this._shiftMultiplier;
    }
    static shiftBundle(bundle) {
        bundle.attr("d", (d) => d.d());
    }
    class() {
        // modified link's class
        return this.links[0].class().replace(/^link/, "bundle");
    }
    bundleId() {
        return `bundle${this.id}`;
    }
}


/***/ }),

/***/ "./src/link.ts":
/*!*********************!*\
  !*** ./src/link.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Link: () => (/* binding */ Link),
/* harmony export */   LinkBase: () => (/* binding */ LinkBase)
/* harmony export */ });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bundle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bundle */ "./src/bundle.ts");
/* harmony import */ var _meta_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./meta_data */ "./src/meta_data.ts");
/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node */ "./src/node.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util */ "./src/util.ts");





class LinkBase {
    constructor(data, id, options) {
        this.id = id;
        this.options = options;
        this.source = _node__WEBPACK_IMPORTED_MODULE_3__.Node.idByName(data.source);
        this.target = _node__WEBPACK_IMPORTED_MODULE_3__.Node.idByName(data.target);
        this.bundle = data.bundle;
        this.metaList = new _meta_data__WEBPACK_IMPORTED_MODULE_2__.MetaData(data.meta).get(options.metaKeys);
        this.sourceMeta = new _meta_data__WEBPACK_IMPORTED_MODULE_2__.MetaData(data.meta, "source").get(options.metaKeys);
        this.targetMeta = new _meta_data__WEBPACK_IMPORTED_MODULE_2__.MetaData(data.meta, "target").get(options.metaKeys);
        this.extraClass = data.class || "";
        if (typeof options.linkWidth === "function")
            this.width = options.linkWidth(data.meta) || 3;
        else
            this.width = options.linkWidth || 3;
        this.defaultMargin = 15;
        this.labelXOffset = 20;
        this.labelYOffset = 1.5; // em
        this.color = "#7a4e4e";
        this.register(id);
    }
    register(id) {
        Link.groups = Link.groups || {};
        // source and target
        const key = [this.source, this.target].sort().toString();
        (Link.groups[key] || (Link.groups[key] = [])).push(id);
    }
    isLabelledPath() {
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
    isLabelVisible() {
        const pathLength = document.getElementById(this.pathId()).getTotalLength();
        const isShort = Array.from(document.getElementsByClassName(this.pathId())).some((p) => {
            // <text /> has only one <textPath />
            const tp = p.firstChild;
            // center label
            if (tp.classList.contains("center")) {
                return tp.getComputedTextLength() > pathLength;
            }
            else {
                return tp.getComputedTextLength() + this.labelXOffset > pathLength;
            }
        });
        d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(`text.${this.pathId()}`).classed("short", isShort);
        // Link.scale is initially undefined
        return Link.scale > 1.5 && !isShort;
    }
    group() {
        return Link.groups[[this.source.id, this.target.id].sort().toString()];
    }
    // OPTIMIZE: Implement better right-alignment of the path, especially for multi tspans
    tspanXOffset() {
        switch (true) {
            case this.isLabelledPath():
                return 0;
            case this.isReversePath():
                return -this.labelXOffset;
            default:
                return this.labelXOffset;
        }
    }
    tspanYOffset() {
        if (this.isLabelledPath())
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
        if (!this.metaList && !this.sourceMeta && !this.targetMeta)
            return [this];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        return `link ${(0,_util__WEBPACK_IMPORTED_MODULE_4__.classify)(this.source.name)} ${(0,_util__WEBPACK_IMPORTED_MODULE_4__.classify)(this.target.name)} ${(0,_util__WEBPACK_IMPORTED_MODULE_4__.classify)(this.source.name)}-${(0,_util__WEBPACK_IMPORTED_MODULE_4__.classify)(this.target.name)} ${this.extraClass}`;
    }
    // after transform is applied
    centerCoordinates() {
        const link = d3__WEBPACK_IMPORTED_MODULE_0__.select(`.link #${this.linkId()}`).node();
        const bbox = link.getBBox();
        const transform = link.transform.baseVal.consolidate();
        return [
            bbox.x + bbox.width / 2 + ((transform === null || transform === void 0 ? void 0 : transform.matrix.e) || 0),
            bbox.y + bbox.height / 2 + ((transform === null || transform === void 0 ? void 0 : transform.matrix.f) || 0),
        ];
    }
    angle() {
        const link = d3__WEBPACK_IMPORTED_MODULE_0__.select(`.link #${this.linkId()}`).node();
        return ((Math.atan2(link.y2.baseVal.value - link.y1.baseVal.value, link.x2.baseVal.value - link.x1.baseVal.value) * 180) /
            Math.PI);
    }
    static render(linkLayer, // eslint-disable-line @typescript-eslint/no-explicit-any
    labelLayer, // eslint-disable-line @typescript-eslint/no-explicit-any
    links) {
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
            Link.appendMetaText(this, d.metaList);
            Link.appendMetaText(this, d.sourceMeta);
            Link.appendMetaText(this, d.targetMeta);
            if (d.isLabelledPath())
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
    static appendMetaText(container, meta) {
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
        if (path) {
            path.attr("d", (d) => d.d());
        }
        if (label) {
            label.attr("transform", function (d) {
                return d.rotate(this.getBBox());
            });
        }
        // hide labels when the path is too short
        d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(".link text").style("visibility", (d) => (d.isLabelVisible() ? "visible" : "hidden"));
    }
    static zoom(scale) {
        Link.scale = scale;
        d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(".link text").style("visibility", (d) => (d.isLabelVisible() ? "visible" : "hidden"));
    }
    static setPosition(link, position) {
        link
            .attr("x1", (d, i) => position[i].x1)
            .attr("y1", (d, i) => position[i].y1)
            .attr("x2", (d, i) => position[i].x2)
            .attr("y2", (d, i) => position[i].y2);
    }
    shiftMultiplier() {
        if (!this._shiftMultiplier) {
            const members = this.group() || [];
            this._shiftMultiplier = members.indexOf(this.id) - (members.length - 1) / 2;
        }
        return this._shiftMultiplier;
    }
    static shiftBundle(link, path, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    label, bundle) {
        const transform = (d) => d.shiftBundle(d.shiftMultiplier());
        link.attr("transform", transform);
        path.attr("transform", transform);
        label.attr("transform", transform);
        _bundle__WEBPACK_IMPORTED_MODULE_1__.Bundle.shiftBundle(bundle);
    }
    shiftBundle(multiplier) {
        const gap = this.margin() * multiplier;
        const x = this.target.x - this.source.x;
        const y = this.target.y - this.source.y;
        const length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return `translate(${(-gap * y) / length}, ${(gap * x) / length})`;
    }
    static reset() {
        Link.groups = null;
    }
}
const Eventable = (Base) => {
    class EventableLink extends Base {
        constructor(data, id, options) {
            super(data, id, options);
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
        constructor(data, id, options) {
            super(data, id, options);
            for (const constructor of Link.pluginConstructors) {
                // Call Pluggable at last as constructor may call methods defined in other classes
                constructor.bind(this)(data, id, options);
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
/*!*******************************************!*\
  !*** ./plugins/arrows_link/src/plugin.ts ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArrowsLinkPlugin: () => (/* binding */ ArrowsLinkPlugin),
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
        static load(Group, Node, Link) {
            Link.registerConstructor(function (
            /* eslint-disable @typescript-eslint/no-unused-vars */
            data, id, metaKeys, linkWidth) {
                this.selected = false;
                this.on("rendered", (element) => {
                    _a.appendMarker(element);
                    if (!_a.isMarkerDefined) {
                        _a.defineMarkers();
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
            _a.isMarkerDefined = true;
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

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=plugin.js.map