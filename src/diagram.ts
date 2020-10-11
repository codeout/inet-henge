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
    initialTicks: number,
    ticks: number,
    positionCache: boolean | string,
    bundle: boolean,
    pop: RegExp,
    distance: LinkWidthFunction,
    tooltip: string;

    // Internal options
    selector: string,
    urlOrData: string | InetHengeDataType,
    groupPattern: RegExp | undefined,
    // Fix @types/d3/index.d.ts. Should be "d3.scale.Ordinal<number, string>" but "d3.scale.Ordinal<string, string>" somehow
    color: d3.scale.Ordinal<any, string>;  // eslint-disable-line @typescript-eslint/no-explicit-any
    maxTicks: number,

    meta: string[],
};

export class Diagram {
    private options: DiagramOptionType;
    private setDistance: (number) => void;
    private dispatch: d3.Dispatch;
    private getLinkWidth: LinkWidthFunction;
    private zoom: d3.behavior.Zoom<unknown>;
    private cola: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
    private uniqueUrl: string;
    private positionCache: PositionCache;
    private indicator: d3.Selection<any>;  // eslint-disable-line @typescript-eslint/no-explicit-any
    private initialTranslate: [number, number];
    private initialScale: number;
    private svg: d3.Selection<any>;  // eslint-disable-line @typescript-eslint/no-explicit-any

    constructor(container: string, urlOrData: string | InetHengeDataType, options: DiagramOptionType) {
        this.options = options || <DiagramOptionType>{};
        this.options.selector = container;
        this.options.urlOrData = urlOrData;
        this.options.groupPattern = options.pop;
        this.options.width = options.width || 960;
        this.options.height = options.height || 600;

        this.options.color = d3.scale.category20();
        this.options.initialTicks = options.initialTicks || 0;
        this.options.maxTicks = options.ticks || 1000;
        // NOTE: true or 'fixed' (experimental) affects behavior
        this.options.positionCache = 'positionCache' in options ? options.positionCache : true;
        // NOTE: This is an experimental option
        this.options.bundle = 'bundle' in options ? options.bundle : false;
        this.options.tooltip = options.tooltip;

        this.setDistance = this.linkDistance(options.distance || 150);

        // Create events
        this.dispatch = d3.dispatch('rendered');
    }

    linkDistance(distance: number | ((any) => number)): (any) => number {
        if (typeof distance === 'function')
            return distance;
        else
            return (cola) => cola.linkDistance(distance);
    }

    linkWidth(func: LinkWidthFunction): void {
        this.getLinkWidth = func;
    }

    link_width(func: LinkWidthFunction): void { // Deprecated
        console.warn('link_width() is deprecated. Use linkWidth()');
        this.linkWidth(func);
    }

    init(...meta: string[]): void {
        this.options.meta = meta;
        this.cola = this.initCola();
        this.svg = this.initSvg();

        this.displayLoadMessage();

        if (typeof this.options.urlOrData === 'object') {
            setTimeout(() => {  // Run asynchronously
                this.render(<InetHengeDataType>this.options.urlOrData);
            });
        } else {
            d3.json(this.url(), (error, data) => {
                if (error) {
                    console.error(error);
                    this.showMessage(`Failed to load "${this.url()}"`);
                }

                this.render(data);
            });
        }
    }

    initCola(): any {  // eslint-disable-line @typescript-eslint/no-explicit-any
        return cola.d3adaptor()
            .avoidOverlaps(true)
            .handleDisconnected(false)
            .size([this.options.width, this.options.height]);
    }

    initSvg(): d3.Selection<any> {  // eslint-disable-line @typescript-eslint/no-explicit-any
        this.zoom = d3.behavior.zoom();
        const container = d3.select(this.options.selector).append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .append('g')
            .call(
                this.zoom.on('zoom', () => this.zoomCallback(container))
            ).append('g');

        container.append('rect')
            .attr('width', this.options.width * 10) // 10 is huge enough
            .attr('height', this.options.height * 10)
            .attr('transform', `translate(-${this.options.width * 5}, -${this.options.height * 5})`)
            .style('opacity', 0);

        return container;
    }

    url(): string {
        if (this.uniqueUrl) {
            return this.uniqueUrl;
        }

        this.uniqueUrl = `${this.options.urlOrData}?${new Date().getTime()}`;
        return this.uniqueUrl;
    }

    render(data: InetHengeDataType): void {
        try {
            const nodes = data.nodes ?
                data.nodes.map((n, i) => new Node(n, i, this.options.meta, this.options.color, this.options.tooltip !== undefined)) : [];
            const links = data.links ?
                data.links.map((l, i) => new Link(l, i, this.options.meta, this.getLinkWidth)) : [];
            const groups = Group.divide(nodes, this.options.groupPattern, this.options.color);
            const tooltips = nodes.map((n) => new Tooltip(n, this.options.tooltip));

            this.cola.nodes(nodes)
                .links(links)
                .groups(groups);
            this.setDistance(this.cola);

            // Start to update Link.source and Link.target with Node object after
            // initial layout iterations without any constraints.
            this.cola.start(this.options.initialTicks, 0, 0, 0);

            const groupLayer = this.svg.append('g').attr('id', 'groups');
            const linkLayer = this.svg.append('g').attr('id', 'links');
            const nodeLayer = this.svg.append('g').attr('id', 'nodes');
            const linkLabelLayer = this.svg.append('g').attr('id', 'link-labels');
            const tooltipLayer = this.svg.append('g').attr('id', 'tooltips');

            const [link, path, label] = Link.render(linkLayer, linkLabelLayer, links);

            const group = Group.render(groupLayer, groups).call(
                this.cola.drag()
                    .on('dragstart', this.dragstartCallback)
                    .on('drag', () => {
                        if (this.options.bundle) {
                            Link.shiftBundle(link, path, label);
                        }
                    })
            );

            const node = Node.render(nodeLayer, nodes).call(
                this.cola.drag()
                    .on('dragstart', this.dragstartCallback)
                    .on('drag', () => {
                        if (this.options.bundle) {
                            Link.shiftBundle(link, path, label);
                        }

                        Tooltip.followNode(tooltip);
                    })
            );

            // without path calculation
            this.configureTick(group, node, link);

            this.positionCache = PositionCache.load(data, this.options.groupPattern);
            if (this.options.positionCache && this.positionCache) {
                // NOTE: Evaluate only when positionCache: true or 'fixed', and
                //       when the stored position cache matches pair of given data and pop
                Group.setPosition(group, this.positionCache.group);
                Node.setPosition(node, this.positionCache.node);
                Link.setPosition(link, this.positionCache.link);
            } else {
                this.ticksForward();
                this.positionCache = new PositionCache(data, this.options.groupPattern);
                this.savePosition(group, node, link);
            }

            this.hideLoadMessage();

            // render path
            this.configureTick(group, node, link, path, label);

            if (this.options.bundle) {
                Link.shiftBundle(link, path, label);
            }

            path.attr('d', (d) => d.d()); // make sure path calculation is done
            this.freeze(node);

            const tooltip = Tooltip.render(tooltipLayer, tooltips);

            this.dispatch.rendered();

            // NOTE: This is an experimental option
            if (this.options.positionCache === 'fixed') {
                this.cola.on('end', () => {
                    this.savePosition(group, node, link);
                });
            }
        } catch (e) {
            this.showMessage(e);
            throw e;
        }
    }

    configureTick(group: d3.Selection<Group>, node: d3.Selection<Node>, link: d3.Selection<Link>, path?: d3.Selection<Link>, label?: d3.Selection<any>): void {  // eslint-disable-line @typescript-eslint/no-explicit-any
        this.cola.on('tick', () => {
            Node.tick(node);
            Link.tick(link, path, label);
            Group.tick(group);
        });
    }

    ticksForward(count?: number): void {
        count = count || this.options.maxTicks;

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

    zoomCallback(container: d3.Selection<any>): void {  // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!this.initialTranslate) {
            this.saveInitialTranslate();
        }

        (<d3.ZoomEvent>d3.event).scale *= this.initialScale;
        (<d3.ZoomEvent>d3.event).translate[0] += this.initialTranslate[0];
        (<d3.ZoomEvent>d3.event).translate[1] += this.initialTranslate[1];

        Link.zoom((<d3.ZoomEvent>d3.event).scale);
        container.attr('transform', `translate(${(<d3.ZoomEvent>d3.event).translate}) scale(${(<d3.ZoomEvent>d3.event).scale})`);
    }

    dragstartCallback(): void {
        (<d3.ZoomEvent>d3.event).sourceEvent.stopPropagation();
    }

    displayLoadMessage(): void {
        this.indicator = this.svg.append('text')
            .attr('x', this.options.width / 2)
            .attr('y', this.options.height / 2)
            .attr('dy', '.35em')
            .style('text-anchor', 'middle')
            .text('Simulating. Just a moment ...');
    }

    hideLoadMessage(): void {
        if (this.indicator)
            this.indicator.remove();
    }

    showMessage(message: string): void {
        if (this.indicator)
            this.indicator.text(message);
    }

    savePosition(group: d3.Selection<Group>, node: d3.Selection<Node>, link: d3.Selection<Link>): void {
        this.positionCache.save(group, node, link);
    }

    saveInitialTranslate(): void {
        const transform = d3.transform(this.svg.attr('transform')); // FIXME: This is valid only for d3.js v3
        this.initialScale = transform.scale[0]; // NOTE: Assuming ky = kx
        this.initialTranslate = transform.translate;
    }

    attr(name: string, value: string): void {
        if (!this.initialTranslate) {
            this.saveInitialTranslate();
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
