import * as d3 from 'd3';

import {Group} from './group';
import {Link, LinkDataType} from './link';
import {Node, NodeDataType} from './node';
import {PositionCache} from './position_cache';
import {Tooltip} from './tooltip';

import './hack_cola';

const cola = require('cola');  // eslint-disable-line @typescript-eslint/no-var-requires

type LinkWidthFunction = (object) => number;
export type InetHengeDataType = { nodes: NodeDataType[], links: LinkDataType[] }
type DiagramOptionType = {
    // Options publicly available
    width: number,
    height: number,
    ticks: number,
    positionCache: boolean | string,
    bundle: boolean,
    pop: RegExp,
    distance: LinkWidthFunction,
    tooltip: string;

    // Internal options
    selector: string,
    urlOrData: string | InetHengeDataType,
    group_pattern: RegExp | undefined,
    // Fix @types/d3/index.d.ts. Should be "d3.scale.Ordinal<number, string>" but "d3.scale.Ordinal<string, string>" somehow
    color: d3.scale.Ordinal<any, string>;  // eslint-disable-line @typescript-eslint/no-explicit-any
    max_ticks: number,
    position_cache: boolean | string,

    meta: string[],
};

export class Diagram {
    private options: DiagramOptionType;
    private set_distance: (number) => void;
    private dispatch: d3.Dispatch;
    private get_link_width: LinkWidthFunction;
    private zoom: d3.behavior.Zoom<unknown>;
    private cola: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
    private unique_url: string;
    private position_cache: PositionCache;
    private indicator: d3.Selection<any>;  // eslint-disable-line @typescript-eslint/no-explicit-any
    private initial_translate: [number, number];
    private initial_scale: number;
    private svg: d3.Selection<any>;  // eslint-disable-line @typescript-eslint/no-explicit-any

    constructor(container: string, urlOrData: string | InetHengeDataType, options: DiagramOptionType) {
        this.options = options || <DiagramOptionType>{};
        this.options.selector = container;
        this.options.urlOrData = urlOrData;
        this.options.group_pattern = options.pop;
        this.options.width = options.width || 960;
        this.options.height = options.height || 600;

        this.options.color = d3.scale.category20();
        this.options.max_ticks = options.ticks || 1000;
        // NOTE: true or 'fixed' (experimental) affects behavior
        this.options.position_cache = 'positionCache' in options ? options.positionCache : true;
        // NOTE: This is an experimental option
        this.options.bundle = 'bundle' in options ? options.bundle : false;
        this.options.tooltip = options.tooltip;

        this.set_distance = this.link_distance(options.distance || 150);

        // Create events
        this.dispatch = d3.dispatch('rendered');
    }

    link_distance(distance: number | ((any) => number)): (any) => number {
        if (typeof distance === 'function')
            return distance;
        else
            return (cola) => cola.linkDistance(distance);
    }

    linkWidth(func: LinkWidthFunction): void {
        this.get_link_width = func;
    }

    link_width(func: LinkWidthFunction): void { // Deprecated
        console.warn('link_width() is deprecated. Use linkWidth()');
        this.linkWidth(func);
    }

    init(...meta: string[]): void {
        this.options.meta = meta;
        this.cola = this.init_cola();
        this.svg = this.init_svg();

        this.display_load_message();

        if (typeof this.options.urlOrData === 'object') {
            setTimeout(() => {  // Run asynchronously
                this.render(<InetHengeDataType>this.options.urlOrData);
            });
        } else {
            d3.json(this.url(), (error, data) => {
                if (error) {
                    console.error(error);
                    this.show_message(`Failed to load "${this.url()}"`);
                }

                this.render(data);
            });
        }
    }

    init_cola(): any {  // eslint-disable-line @typescript-eslint/no-explicit-any
        return cola.d3adaptor()
            .avoidOverlaps(true)
            .handleDisconnected(false)
            .size([this.options.width, this.options.height]);
    }

    init_svg(): d3.Selection<any> {  // eslint-disable-line @typescript-eslint/no-explicit-any
        this.zoom = d3.behavior.zoom();
        const container = d3.select(this.options.selector).append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .append('g')
            .call(
                this.zoom.on('zoom', () => this.zoom_callback(container))
            ).append('g');

        container.append('rect')
            .attr('width', this.options.width * 10) // 10 is huge enough
            .attr('height', this.options.height * 10)
            .attr('transform', `translate(-${this.options.width * 5}, -${this.options.height * 5})`)
            .style('opacity', 0);

        return container;
    }

    url(): string {
        if (this.unique_url) {
            return this.unique_url;
        }

        this.unique_url = `${this.options.urlOrData}?${new Date().getTime()}`;
        return this.unique_url;
    }

    render(data: InetHengeDataType): void {
        try {
            const nodes = data.nodes ?
                data.nodes.map((n, i) => new Node(n, i, this.options.meta, this.options.color, this.options.tooltip !== undefined)) : [];
            const links = data.links ?
                data.links.map((l, i) => new Link(l, i, this.options.meta, this.get_link_width)) : [];
            const groups = Group.divide(nodes, this.options.group_pattern, this.options.color);
            const tooltips = nodes.map((n) => new Tooltip(n, this.options.tooltip));

            this.cola.nodes(nodes)
                .links(links)
                .groups(groups);
            this.set_distance(this.cola);

            this.cola.start(); // Update Link.source and Link.target with Node object

            const groupLayer = this.svg.append('g').attr('id', 'groups');
            const linkLayer = this.svg.append('g').attr('id', 'links');
            const nodeLayer = this.svg.append('g').attr('id', 'nodes');
            const linkLabelLayer = this.svg.append('g').attr('id', 'link-labels');
            const tooltipLayer = this.svg.append('g').attr('id', 'tooltips');

            const [link, path, label] = Link.render(linkLayer, linkLabelLayer, links);

            const group = Group.render(groupLayer, groups).call(
                this.cola.drag()
                    .on('dragstart', this.dragstart_callback)
                    .on('drag', () => {
                        if (this.options.bundle) {
                            Link.shift_bundle(link, path, label);
                        }
                    })
            );

            const node = Node.render(nodeLayer, nodes).call(
                this.cola.drag()
                    .on('dragstart', this.dragstart_callback)
                    .on('drag', () => {
                        if (this.options.bundle) {
                            Link.shift_bundle(link, path, label);
                        }

                        Tooltip.followNode(tooltip);
                    })
            );

            // without path calculation
            this.configure_tick(group, node, link);

            this.position_cache = PositionCache.load(data, this.options.group_pattern);
            if (this.options.position_cache && this.position_cache) {
                // NOTE: Evaluate only when positionCache: true or 'fixed', and
                //       when the stored position cache matches pair of given data and pop
                Group.set_position(group, this.position_cache.group);
                Node.set_position(node, this.position_cache.node);
                Link.set_position(link, this.position_cache.link);
            } else {
                this.ticks_forward();
                this.position_cache = new PositionCache(data, this.options.group_pattern);
                this.save_position(group, node, link);
            }

            this.hide_load_message();

            // render path
            this.configure_tick(group, node, link, path, label);

            if (this.options.bundle) {
                Link.shift_bundle(link, path, label);
            }

            path.attr('d', (d) => d.d()); // make sure path calculation is done
            this.freeze(node);

            const tooltip = Tooltip.render(tooltipLayer, tooltips);

            this.dispatch.rendered();

            // NOTE: This is an experimental option
            if (this.options.position_cache === 'fixed') {
                this.cola.on('end', () => {
                    this.save_position(group, node, link);
                });
            }
        } catch (e) {
            this.show_message(e);
            throw e;
        }
    }

    configure_tick(group: d3.Selection<Group>, node: d3.Selection<Node>, link: d3.Selection<Link>, path?: d3.Selection<Link>, label?: d3.Selection<any>): void {  // eslint-disable-line @typescript-eslint/no-explicit-any
        this.cola.on('tick', () => {
            Node.tick(node);
            Link.tick(link, path, label);
            Group.tick(group);
        });
    }

    ticks_forward(count?: number): void {
        count = count || this.options.max_ticks;

        for (let i = 0; i < count; i++)
            this.cola.tick();
    }

    freeze(container: d3.Selection<any>): void {  // eslint-disable-line @typescript-eslint/no-explicit-any
        container.each((d) => d.fixed = true);
    }

    destroy(): void {
        d3.select('body svg').remove();
        Node.reset();
        Link.reset();
    }

    zoom_callback(container: d3.Selection<any>): void {  // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!this.initial_translate) {
            this.save_initial_translate();
        }

        (<d3.ZoomEvent>d3.event).scale *= this.initial_scale;
        (<d3.ZoomEvent>d3.event).translate[0] += this.initial_translate[0];
        (<d3.ZoomEvent>d3.event).translate[1] += this.initial_translate[1];

        Link.zoom((<d3.ZoomEvent>d3.event).scale);
        container.attr('transform', `translate(${(<d3.ZoomEvent>d3.event).translate}) scale(${(<d3.ZoomEvent>d3.event).scale})`);
    }

    dragstart_callback(): void {
        (<d3.ZoomEvent>d3.event).sourceEvent.stopPropagation();
    }

    display_load_message(): void {
        this.indicator = this.svg.append('text')
            .attr('x', this.options.width / 2)
            .attr('y', this.options.height / 2)
            .attr('dy', '.35em')
            .style('text-anchor', 'middle')
            .text('Simulating. Just a moment ...');
    }

    hide_load_message(): void {
        if (this.indicator)
            this.indicator.remove();
    }

    show_message(message: string): void {
        if (this.indicator)
            this.indicator.text(message);
    }

    save_position(group: d3.Selection<Group>, node: d3.Selection<Node>, link: d3.Selection<Link>): void {
        this.position_cache.save(group, node, link);
    }

    save_initial_translate(): void {
        const transform = d3.transform(this.svg.attr('transform')); // FIXME: This is valid only for d3.js v3
        this.initial_scale = transform.scale[0]; // NOTE: Assuming ky = kx
        this.initial_translate = transform.translate;
    }

    attr(name: string, value: string): void {
        if (!this.initial_translate) {
            this.save_initial_translate();
        }

        this.svg.attr(name, value);

        const transform = d3.transform(this.svg.attr('transform')); // FIXME: This is valid only for d3.js v3
        this.zoom.scale(transform.scale[0]); // NOTE: Assuming ky = kx
        this.zoom.translate(transform.translate);
    }

    on(name: string, callback: () => any): void {  // eslint-disable-line @typescript-eslint/no-explicit-any
        this.dispatch.on(name, callback);
    }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.Diagram = Diagram;
