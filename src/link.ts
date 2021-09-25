import * as d3 from 'd3';

import {LinkPosition} from './position_cache';
import {MetaData, MetaDataType} from './meta_data';
import {Node} from './node';
import {classify} from './util';

export type LinkDataType = {
    source: string,
    target: string,
    meta: Record<string, any>,  // eslint-disable-line @typescript-eslint/no-explicit-any
    class: string,
}

export class Link {
    private static groups: Record<string, any>;  // eslint-disable-line @typescript-eslint/no-explicit-any

    private source: number | Node;
    private target: number | Node;
    private meta: MetaDataType[];
    private sourceMeta: MetaDataType[];
    private targetMeta: MetaDataType[];
    private extraClass: string;
    private width: number;
    private defaultMargin: number;
    private labelXOffset: number;
    private labelYOffset: number;
    // Fix @types/d3/index.d.ts. Should be "d3.scale.Ordinal<number, string>" but "d3.scale.Ordinal<string, string>" somehow
    // Also, it should have accepted undefined
    private color: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
    private _margin: number;

    constructor(data: LinkDataType, public id: number, metaKeys: string[], linkWidth: (object) => number) {
        this.source = Node.idByName(data.source);
        this.target = Node.idByName(data.target);
        this.meta = new MetaData(data.meta).get(metaKeys);
        this.sourceMeta = new MetaData(data.meta, 'source').get(metaKeys);
        this.targetMeta = new MetaData(data.meta, 'target').get(metaKeys);
        this.extraClass = data.class || '';

        if (typeof linkWidth === 'function')
            this.width = linkWidth(data.meta) || 3;
        else
            this.width = linkWidth || 3;

        this.defaultMargin = 15;
        this.labelXOffset = 20;
        this.labelYOffset = 1.5; // em
        this.color = '#7a4e4e';

        this.register(id, this.source, this.target);
    }

    isNamedPath(): boolean {
        return this.meta.length > 0;
    }

    isReversePath(): boolean {
        return this.targetMeta.length > 0;
    }

    d(): string {
        return `M ${(<Node>this.source).x} ${(<Node>this.source).y} L ${(<Node>this.target).x} ${(<Node>this.target).y}`;
    }

    pathId(): string {
        return `path${this.id}`;
    }

    linkId(): string {
        return `link${this.id}`;
    }

    margin(): number {
        if (!this._margin) {
            const margin = window.getComputedStyle(document.getElementById(this.linkId())).margin;

            // NOTE: Assuming that window.getComputedStyle() returns some value link "10px"
            // or "0px" even when not defined in .css
            if (!margin || margin === '0px') {
                this._margin = this.defaultMargin;
            } else {
                this._margin = parseInt(margin);
            }
        }

        return this._margin;
    }

    // OPTIMIZE: Implement better right-alignment of the path, especially for multi tspans
    tspanXOffset(): number {
        if (this.isNamedPath())
            return 0;
        else if (this.isReversePath())
            return -this.labelXOffset;
        else
            return this.labelXOffset;
    }

    tspanYOffset(): string {
        if (this.isNamedPath())
            return `${-this.labelYOffset + 0.7}em`;
        else
            return `${this.labelYOffset}em`;
    }

    rotate(bbox: SVGRect): string {
        if ((<Node>this.source).x > (<Node>this.target).x)
            return `rotate(180 ${bbox.x + bbox.width / 2} ${bbox.y + bbox.height / 2})`;
        else
            return 'rotate(0)';
    }

    split(): Record<string, any>[] {  // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!this.meta && !this.sourceMeta && !this.targetMeta)
            return [this];

        const meta = [];
        ['meta', 'sourceMeta', 'targetMeta'].forEach((key, i, keys) => {
            if (this[key]) {
                const duped = Object.assign(Object.create(this), this);

                keys.filter((k) => k !== key).forEach((k) => duped[k] = []);
                meta.push(duped);
            }
        });

        return meta;
    }

    hasMeta(): boolean {
        return this.meta.length > 0 || this.sourceMeta.length > 0 || this.targetMeta.length > 0;
    }

    class(): string {
        // eslint-disable-next-line max-len
        return `link ${classify((<Node>this.source).name)} ${classify((<Node>this.target).name)} ${classify((<Node>this.source).name)}-${classify((<Node>this.target).name)} ${this.extraClass}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static render(linkLayer: d3.Selection<any>, labelLayer: d3.Selection<any>, links: Link[]): [d3.Selection<Link>, d3.Selection<Link>, d3.Selection<any>] {
        // Render lines
        const pathGroup = linkLayer.selectAll('.link')
            .data(links)
            .enter()
            .append('g')
            .attr('class', (d) => d.class());

        const link = pathGroup.append('line')
            .attr('x1', (d) => (<Node>d.source).x)
            .attr('y1', (d) => (<Node>d.source).y)
            .attr('x2', (d) => (<Node>d.target).x)
            .attr('y2', (d) => (<Node>d.target).y)
            .attr('stroke', (d) => d.color)
            .attr('stroke-width', (d) => d.width)
            .attr('id', (d) => d.linkId())
            .on('mouseover.line', (d) => textGroup.selectAll(`text.${d.pathId()}`).classed('hover', true))
            .on('mouseout.line', (d) => textGroup.selectAll(`text.${d.pathId()}`).classed('hover', false));

        const path = pathGroup.append('path')
            .attr('d', (d) => d.d())
            .attr('id', (d) => d.pathId());

        // Render texts
        const textGroup = labelLayer.selectAll('.link')
            .data(links)
            .enter()
            .append('g')
            .attr('class', (d) => d.class());

        const text = textGroup.selectAll('text')
            .data((d: Link) => d.split().filter((l: Link) => l.hasMeta()))
            .enter()
            .append('text')
            .attr('class', (d: Link) => d.pathId()); // Bind text with pathId as class

        const textPath = text.append('textPath')
            .attr('xlink:href', (d: Link) => `#${d.pathId()}`);

        textPath.each(function (d: Link) {
            Link.appendTspans(this, d.meta);
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

    static theOtherEnd(container: SVGGElement): void {
        d3.select(container)
            .attr('class', 'reverse')
            .attr('text-anchor', 'end')
            .attr('startOffset', '100%');
    }

    static center(container: SVGGElement): void {
        d3.select(container)
            .attr('class', 'center')
            .attr('text-anchor', 'middle')
            .attr('startOffset', '50%');
    }

    static appendTspans(container: SVGGElement, meta: MetaDataType[]): void {
        meta.forEach((m) => {
            d3.select(container).append('tspan')
                .attr('x', (d: Link) => d.tspanXOffset())
                .attr('dy', (d: Link) => d.tspanYOffset())
                .attr('class', m.class)
                .text(m.value);
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static tick(link: d3.Selection<Link>, path: d3.Selection<Link>, label: d3.Selection<any>): void {
        link.attr('x1', (d) => (<Node>d.source).x)
            .attr('y1', (d) => (<Node>d.source).y)
            .attr('x2', (d) => (<Node>d.target).x)
            .attr('y2', (d) => (<Node>d.target).y);

        if (path)
            path.attr('d', (d) => d.d());
        if (label)
            label.attr('transform', function (d: Link) {
                return d.rotate(this.getBBox());
            });
    }

    static zoom(scale?: number): void {
        let visibility = 'hidden';
        if (scale && scale > 1.5)
            visibility = 'visible';

        d3.selectAll('.link text')
            .style('visibility', visibility);
    }

    static setPosition(link: d3.Selection<Link>, position: LinkPosition[]): void {
        link.attr('x1', (d, i) => position[i].x1)
            .attr('y1', (d, i) => position[i].y1)
            .attr('x2', (d, i) => position[i].x2)
            .attr('y2', (d, i) => position[i].y2);
    }

    register(id: number, source: number, target: number): void {
        Link.groups = Link.groups || {};
        const key = [source, target].sort().toString();
        Link.groups[key] = Link.groups[key] || [];
        Link.groups[key].push(id);
    }

    static shiftMultiplier(link: Link): number {
        const members = Link.groups[[(<Node>link.source).id, (<Node>link.target).id].sort().toString()] || [];
        return members.indexOf(link.id) - (members.length - 1) / 2;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static shiftBundle(link: d3.Selection<Link>, path: d3.Selection<Link>, label: d3.Selection<any>): void {
        const transform = (d) => d.shiftBundle(Link.shiftMultiplier(d));

        link.attr('transform', transform);
        path.attr('transform', transform);
        label.attr('transform', transform);
    }

    shiftBundle(multiplier: number): string {
        const gap = this.margin() * multiplier;

        const width = Math.abs((<Node>this.target).x - (<Node>this.source).x);
        const height = Math.abs((<Node>this.source).y - (<Node>this.target).y);
        const length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

        return `translate(${gap * height / length}, ${gap * width / length})`;
    }

    static reset(): void {
        Link.groups = null;
    }
}
