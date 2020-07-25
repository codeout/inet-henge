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
    private source_meta: MetaDataType[];
    private target_meta: MetaDataType[];
    private extra_class: string;
    private width: number;
    private default_margin: number;
    private label_x_offset: number;
    private label_y_offset: number;
    // Fix @types/d3/index.d.ts. Should be "d3.scale.Ordinal<number, string>" but "d3.scale.Ordinal<string, string>" somehow
    // Also, it should have accepted undefined
    private color: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
    private _margin: number;

    constructor(data: LinkDataType, public id: number, meta_keys: string[], link_width: (object) => number) {
        this.source = Node.id_by_name(data.source);
        this.target = Node.id_by_name(data.target);
        this.meta = new MetaData(data.meta).get(meta_keys);
        this.source_meta = new MetaData(data.meta, 'source').get(meta_keys);
        this.target_meta = new MetaData(data.meta, 'target').get(meta_keys);
        this.extra_class = data.class || '';

        if (typeof link_width === 'function')
            this.width = link_width(data.meta) || 3;
        else
            this.width = link_width || 3;

        this.default_margin = 15;
        this.label_x_offset = 20;
        this.label_y_offset = 1.5; // em
        this.color = '#7a4e4e';

        this.register(id, this.source, this.target);
    }

    is_named_path(): boolean {
        return this.meta.length > 0;
    }

    is_reverse_path(): boolean {
        return this.target_meta.length > 0;
    }

    d(): string {
        return `M ${(<Node>this.source).x} ${(<Node>this.source).y} L ${(<Node>this.target).x} ${(<Node>this.target).y}`;
    }

    path_id(): string {
        return `path${this.id}`;
    }

    link_id(): string {
        return `link${this.id}`;
    }

    margin(): number {
        if (!this._margin) {
            const margin = window.getComputedStyle(document.getElementById(this.link_id())).margin;

            // NOTE: Assuming that window.getComputedStyle() returns some value link "10px"
            // or "0px" even when not defined in .css
            if (!margin || margin === '0px') {
                this._margin = this.default_margin;
            } else {
                this._margin = parseInt(margin);
            }
        }

        return this._margin;
    }

    // OPTIMIZE: Implement better right-alignment of the path, especially for multi tspans
    tspan_x_offset(): number {
        if (this.is_named_path())
            return 0;
        else if (this.is_reverse_path())
            return -this.label_x_offset;
        else
            return this.label_x_offset;
    }

    tspan_y_offset(): string {
        if (this.is_named_path())
            return `${-this.label_y_offset + 0.7}em`;
        else
            return `${this.label_y_offset}em`;
    }

    rotate(bbox: SVGRect): string {
        if ((<Node>this.source).x > (<Node>this.target).x)
            return `rotate(180 ${bbox.x + bbox.width / 2} ${bbox.y + bbox.height / 2})`;
        else
            return 'rotate(0)';
    }

    split(): Record<string, any>[] {  // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!this.meta && !this.source_meta && !this.target_meta)
            return [this];

        const meta = [];
        ['meta', 'source_meta', 'target_meta'].forEach((key, i, keys) => {
            if (this[key]) {
                const duped = Object.assign(Object.create(this), this);

                keys.filter((k) => k !== key).forEach((k) => duped[k] = []);
                meta.push(duped);
            }
        });

        return meta;
    }

    has_meta(): boolean {
        return this.meta.length > 0 || this.source_meta.length > 0 || this.target_meta.length > 0;
    }

    class(): string {
        // eslint-disable-next-line max-len
        return `link ${classify((<Node>this.source).name)} ${classify((<Node>this.target).name)} ${classify((<Node>this.source).name)}-${classify((<Node>this.target).name)} ${this.extra_class}`;
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
            .attr('id', (d) => d.link_id())
            .on('mouseover.line', (d) => textGroup.selectAll(`text.${d.path_id()}`).classed('hover', true))
            .on('mouseout.line', (d) => textGroup.selectAll(`text.${d.path_id()}`).classed('hover', false));

        const path = pathGroup.append('path')
            .attr('d', (d) => d.d())
            .attr('id', (d) => d.path_id());

        // Render texts
        const textGroup = labelLayer.selectAll('.link')
            .data(links)
            .enter()
            .append('g')
            .attr('class', (d) => d.class());

        const text = textGroup.selectAll('text')
            .data((d: Link) => d.split().filter((l: Link) => l.has_meta()))
            .enter()
            .append('text')
            .attr('class', (d: Link) => d.path_id()); // Bind text with path_id as class

        const text_path = text.append('textPath')
            .attr('xlink:href', (d: Link) => `#${d.path_id()}`);

        text_path.each(function (d: Link) {
            Link.append_tspans(this, d.meta);
            Link.append_tspans(this, d.source_meta);
            Link.append_tspans(this, d.target_meta);

            if (d.is_named_path())
                Link.center(this);

            if (d.is_reverse_path())
                Link.the_other_end(this);
        });

        Link.zoom(); // Initialize
        return [link, path, text];
    }

    static the_other_end(container: SVGGElement): void {
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

    static append_tspans(container: SVGGElement, meta: MetaDataType[]): void {
        meta.forEach((m) => {
            d3.select(container).append('tspan')
                .attr('x', (d: Link) => d.tspan_x_offset())
                .attr('dy', (d: Link) => d.tspan_y_offset())
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

    static set_position(link: d3.Selection<Link>, position: LinkPosition[]): void {
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

    static shift_multiplier(link: Link): number {
        const members = Link.groups[[(<Node>link.source).id, (<Node>link.target).id].sort().toString()] || [];
        return members.indexOf(link.id) - (members.length - 1) / 2;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static shift_bundle(link: d3.Selection<Link>, path: d3.Selection<Link>, label: d3.Selection<any>): void {
        const transform = (d) => d.shift_bundle(Link.shift_multiplier(d));

        link.attr('transform', transform);
        path.attr('transform', transform);
        label.attr('transform', transform);
    }

    shift_bundle(multiplier: number): string {
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
