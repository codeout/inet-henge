import {GroupPosition} from './position_cache';
import {Node} from './node';
import {classify} from './util';

export class Group {
    private leaves: number[];
    // Not appropriately defined in @types/d3/index.d.ts
    private bounds: any;  // eslint-disable-line @typescript-eslint/no-explicit-any

    // Fix @types/d3/index.d.ts. Should be "d3.scale.Ordinal<number, string>" but "d3.scale.Ordinal<string, string>" somehow
    // Also, it should have accepted undefined
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(private name: string, private color: any) {
        this.leaves = [];
    }

    push(node: Node): void {
        this.leaves.push(node.id);
    }

    transform(): string {
        return `translate(${this.bounds.x}, ${this.bounds.y})`;
    }

    groupWidth(): number {
        return this.bounds.width();
    }

    groupHeight(): number {
        return this.bounds.height();
    }

    // Fix @types/d3/index.d.ts. Should be "d3.scale.Ordinal<number, string>" but "d3.scale.Ordinal<string, string>" somehow
    // Also, it should have accepted undefined
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    static divide(nodes: Node[], pattern: RegExp, color: any): Group[] {
        const groups = {};
        const register = (name: string, node: Node, parent?: string) => {
            const key = `${parent}:${name}`;
            groups[key] = groups[key] || new Group(name, color);
            groups[key].push(node);
        };

        nodes.forEach((node) => {
            let result = null;

            if (pattern) {
                result = node.name.match(pattern);
                if (result) {
                    register(result[1] || result[0], node);
                }
            }

            // Node type based group
            node.group.forEach((name) => register(name, node, String(result)));
        });

        return this.array(groups);
    }

    static array(groups: Record<string, any>): Group[] {  // eslint-disable-line @typescript-eslint/no-explicit-any
        return Object.keys(groups).map((g) => groups[g]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static render(layer: d3.Selection<any>, groups: Group[]): d3.Selection<Group> {
        const group = layer.selectAll('.group')
            .data(groups)
            .enter()
            .append('g')
            .attr('class', (d) => `group ${classify(d.name)}`)
            .attr('transform', (d) => d.transform());

        group.append('rect')
            .attr('rx', 8)
            .attr('ry', 8)
            .attr('width', (d) => d.groupWidth())
            .attr('height', (d) => d.groupHeight())
            .style('fill', (d, i) => d.color(i));

        group.append('text')
            .text((d) => d.name);

        return group;
    }

    static tick(group: d3.Selection<Group>): void {
        group.attr('transform', (d) => d.transform());
        group.selectAll('rect')
            .attr('width', (d) => d.groupWidth())
            .attr('height', (d) => d.groupHeight());
    }

    static setPosition(group: d3.Selection<Group>, position: GroupPosition[]): void {
        group.attr('transform', (d, i) => {
            d.bounds.x = position[i].x;
            d.bounds.y = position[i].y;
            return d.transform();
        });
        group.selectAll('rect')
            .attr('width', (d, i) => position[i].width)
            .attr('height', (d, i) => position[i].height);
    }
}
