import {MetaData, MetaDataType} from './meta_data';
import {classify} from './util';
import * as d3 from 'd3';
import {NodePosition} from './position_cache';

export type NodeDataType = {
    name: string,
    group: string[],
    icon: string,
    meta: object,
    class: string,
}

export class Node {
    private static all: object;

    public name: string;
    public group: string[];
    private icon: string;
    private meta: MetaDataType[];
    private extra_class: string;
    private width: number;
    private height: number;
    private padding: number;
    private tspan_offset: string;
    public x: number;
    public y: number;

    // Fix @types/d3/index.d.ts. Should be "d3.scale.Ordinal<number, string>" but "d3.scale.Ordinal<string, string>" somehow
    // Also, it should have accepted undefined
    constructor(data: NodeDataType, public id: number, meta_keys: string[], private color: any) {
        this.name = data.name;
        this.group = typeof data.group === 'string' ? [data.group] : (data.group || []);
        this.icon = data.icon;
        this.meta = new MetaData(data.meta).get(meta_keys);
        this.extra_class = data.class || '';

        this.width = 60;
        this.height = 40;
        this.padding = 3;
        this.tspan_offset = '1.1em';

        this.register(id, data.name);
    }

    register(id: number, name: string): void {
        Node.all = Node.all || {};
        Node.all[name] = id;
    }

    transform(): string {
        const x = this.x - this.width / 2 + this.padding;
        const y = this.y - this.height / 2 + this.padding;
        return `translate(${x}, ${y})`;
    }

    node_width(): number {
        return this.width - 2 * this.padding;
    }

    node_height(): number {
        return this.height - 2 * this.padding;
    }

    x_for_text(): number {
        return this.width / 2;
    }

    y_for_text(): number {
        return this.height / 2;
    }

    static id_by_name(name: string): number {
        if (Node.all[name] === undefined)
            throw `Unknown node "${name}"`;
        return Node.all[name];
    }

    static render(layer: d3.Selection<any>, nodes: Node[]): d3.Selection<Node> {
        const node = layer.selectAll('.node')
            .data(nodes)
            .enter()
            .append('g')
            .attr('id', (d) => classify(d.name))
            .attr('name', (d) => d.name)
            .attr('transform', (d) => d.transform());

        node.each(function (d) {
            if (d.icon)
                Node.append_image(this);
            else
                Node.append_rect(this);

            Node.append_text(this);
        });

        return node;
    }

    static append_text(container: string): void {
        const text = d3.select(container).append('text')
            .attr('text-anchor', 'middle')
            .attr('x', (d: Node) => d.x_for_text())
            .attr('y', (d: Node) => d.y_for_text());
        text.append('tspan')
            .text((d: Node) => d.name)
            .attr('x', (d: Node) => d.x_for_text());

        text.each((d: Node) => {
            Node.append_tspans(text, d.meta);
        });
    }

    static append_tspans(container: d3.Selection<any>, meta: MetaDataType[]): void {
        meta.forEach((m) => {
            container.append('tspan')
                .attr('x', (d: Node) => d.x_for_text())
                .attr('dy', (d: Node) => d.tspan_offset)
                .attr('class', m.class)
                .text(m.value);
        });
    }

    static append_image(container: string): void {
        d3.select(container).attr('class', (d: Node) => `node image ${classify(d.name)} ${d.extra_class}`)
            .append('image')
            .attr('xlink:href', (d: Node) => d.icon)
            .attr('width', (d: Node) => d.node_width())
            .attr('height', (d: Node) => d.node_height());
    }

    static append_rect(container: string): void {
        d3.select(container).attr('class', (d: Node) => `node rect ${classify(d.name)} ${d.extra_class}`)
            .append('rect')
            .attr('width', (d: Node) => d.node_width())
            .attr('height', (d: Node) => d.node_height())
            .attr('rx', 5)
            .attr('ry', 5)
            .style('fill', (d: Node) => d.color());
    }

    static tick(node:d3.Selection<Node>): void {
        node.attr('transform', (d) => d.transform());
    }

    static set_position(node: d3.Selection<Node>, position: NodePosition[]): void {
        node.attr('transform', (d, i) => {
            d.x = position[i].x;
            d.y = position[i].y;
            return d.transform();
        });
    }
}
