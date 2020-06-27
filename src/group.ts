import {classify} from './util';

export class Group {
    private leaves;
    private bounds;

    constructor(private name, private color) {
        this.leaves = [];
    }

    push(node) {
        this.leaves.push(node.id);
    }

    transform() {
        return `translate(${this.bounds.x}, ${this.bounds.y})`;
    }

    group_width() {
        return this.bounds.width();
    }

    group_height() {
        return this.bounds.height();
    }

    static divide(nodes, pattern, color) {
        const groups = {};
        const register = (name, node, parent?) => {
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
            node.group.forEach((name) => register(name, node, result.toString()));
        });

        return this.array(groups);
    }

    static array(groups) {
        return Object.keys(groups).map((g) => groups[g]);
    }

    static render(layer, groups) {
        const group = layer.selectAll('.group')
            .data(groups)
            .enter()
            .append('g')
            .attr('class', (d) => `group ${classify(d.name)}`)
            .attr('transform', (d) => d.transform());

        group.append('rect')
            .attr('rx', 8)
            .attr('ry', 8)
            .attr('width', (d) => d.group_width())
            .attr('height', (d) => d.group_height())
            .style('fill', (d, i) => d.color(i));

        group.append('text')
            .text((d) => d.name);

        return group;
    }

    static tick(group) {
        group.attr('transform', (d) => d.transform());
        group.selectAll('rect')
            .attr('width', (d) => d.group_width())
            .attr('height', (d) => d.group_height());
    }

    static set_position(group, position) {
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
