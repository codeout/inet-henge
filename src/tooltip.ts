import * as d3 from "d3";

import {MetaDataType} from './meta_data';
import {Node} from './node';
import {classify} from './util';

export class Tooltip {
    private offsetX: number;
    private visibility: string;

    constructor(private node: Node, private eventType: string) {
        this.offsetX = 30;
        this.visibility = 'hidden';
    }

    tspanOffsetY(isHeader: boolean): string {
        return isHeader ? '2em' : '1.1em';
    }

    transform(): string {
        return `translate(${this.node.x}, ${this.node.y})`;
    }

    class(): string {
        return `tooltip ${this.nodeId()}`;
    }

    nodeId(escape = false): string {
        let id = classify((<Node>this.node).name);

        if (escape) {
            id = CSS.escape(id);
        }

        return id;
    }

    // This doesn't actually toggle visibility, but returns string for toggled visibility
    toggleVisibility(): string {
        if (this.visibility === 'hidden') {
            this.visibility = 'visible';
            return 'visible';
        } else {
            this.visibility = 'hidden';
            return 'hidden';
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toggleVisibilityCallback(element: SVGGElement): any {
        return () => {
            // Do nothing for dragging
            if (event.defaultPrevented) {
                return;
            }

            d3.select(element).attr('visibility', this.toggleVisibility());
        };
    }

    configureNodeClickCallback(element: SVGGElement): void {
        d3.select(`#${this.nodeId(true)}`).on('click', this.toggleVisibilityCallback(element));
    }

    configureNodeHoverCallback(element: SVGGElement): void {
        d3.select(`#${this.nodeId(true)}`).on('mouseenter', this.toggleVisibilityCallback(element));
        d3.select(`#${this.nodeId(true)}`).on('mouseleave', this.toggleVisibilityCallback(element));
    }

    disableZoom(element: SVGAElement): void {
        d3.select(element).on('mousedown', () => {
            (<MouseEvent>d3.event).stopPropagation();
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static render(layer: d3.Selection<any>, tooltips: Tooltip[]): d3.Selection<Tooltip> {
        const tooltip = layer.selectAll('.tooltip')
            .data(tooltips)
            .enter()
            .append('g')
            .attr('visibility', (d) => d.visibility)
            .attr('class', (d) => d.class())
            .attr('transform', (d) => d.transform());

        tooltip.each(function (d) {
            Tooltip.appendText(this)

            if (d.eventType === 'hover') {
                d.configureNodeHoverCallback(this);
            } else {
                d.configureNodeClickCallback(this);
            }

            d.disableZoom(this);
        })

        return tooltip;
    }

    static fill(element: SVGPathElement): string {
        // If no "fill" style is defined
        if (getComputedStyle(element).fill.match(/\(0,\s*0,\s*0\)/)) {
            return '#f8f1e9';
        }
    }

    static pathD(x: number, y: number, width: number, height: number): string {
        const round = 8;

        return `M ${x},${y} L ${x + 20},${y - 10} ${x + 20},${y - 20}` +
            `Q ${x + 20},${y - 20 - round} ${x + 20 + round},${y - 20 - round}` +
            `L ${x + 20 + width - round},${y - 20 - round}` +
            `Q ${x + 20 + width},${y - 20 - round} ${x + 20 + width},${y - 20}` +
            `L ${x + 20 + width},${y - 20 + height}` +
            `Q ${x + 20 + width},${y - 20 + height + round} ${x + 20 + width - round},${y - 20 + height + round}` +
            `L ${x + 20 + round},${y - 20 + height + round}` +
            `Q ${x + 20},${y - 20 + height + round} ${x + 20},${y - 20 + height}` +
            `L ${x + 20},${y + 10} Z`;
    }

    static appendText(container: SVGGElement): void {
        const path = d3.select(container).append('path');

        const text = d3.select(container).append('text')
        text.append('tspan')
            .attr('x', (d: Tooltip) => d.offsetX + 40)
            .attr('class', 'name')
            .text('node:');
        text.append('tspan')
            .attr('dx', 10)
            .attr('class', 'value')
            .text((d: Tooltip) => d.node.name);

        text.each(function (d: Tooltip) {
            Tooltip.appendTspans(text, d.node.meta)

            // Add "d" after bbox calculation
            const bbox = this.getBBox();
            path.attr('d', Tooltip.pathD(30, 0, bbox.width + 40, bbox.height + 20))
                .style('fill', function () {
                    return Tooltip.fill(this)
                });
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static appendTspans(container: d3.Selection<any>, meta: MetaDataType[]): void {
        meta.forEach((m, i) => {
            container.append('tspan')
                .attr('x', (d: Tooltip) => d.offsetX + 40)
                .attr('dy', (d: Tooltip) => d.tspanOffsetY(i === 0))
                .attr('class', 'name')
                .text(`${m.class}:`);

            container.append('tspan')
                .attr('dx', 10)
                .attr('class', 'value')
                .text(m.value);
        });
    }

    static followNode(tooltip: d3.Selection<Tooltip>): void {
        tooltip.attr('transform', (d) => d.transform());
    }
}
