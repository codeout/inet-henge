import MetaData from './meta_data';

class Node {
  constructor(data, id, meta_keys, color) {
    this.id = id;
    this.name = data.name;
    this.group = typeof data.group == 'string' ? [data.group] : (data.group || []);
    this.icon = data.icon;
    this.meta = new MetaData(data.meta).slice(meta_keys);
    this.color = color;

    this.width = 60;
    this.height = 40;
    this.padding = 3;
    this.tspan_offset = '1.1em';

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

  node_width() {
    return this.width - 2 * this.padding;
  }

  node_height() {
    return this.height - 2 * this.padding;
  }

  x_for_text() {
    return this.width / 2;
  }

  y_for_text() {
    return this.height / 2;
  }

  static id_by_name(name) {
    if (Node.all[name] == undefined)
      throw `Unknown node "${name}"`;
    return Node.all[name];
  }

  static render(svg, nodes) {
    const container = svg.selectAll('.node')
          .data(nodes)
          .enter()
          .append('g')
          .attr('transform', (d) => d.transform());

    container.each(function(d) {
      if (d.icon)
        Node.append_image(this);
      else
        Node.append_rect(this);

      Node.append_text(this);
    });

    return container;
  }

  static append_text(container) {
    const text = d3.select(container).append('text')
          .attr('text-anchor', 'middle')
          .attr('x', (d) => d.x_for_text())
          .attr('y', (d) => d.y_for_text());
    text.append('tspan')
      .text((d) => d.name)
      .attr('x', (d) => d.x_for_text());

    text.each(function(d) {
      Node.append_tspans(text, d.meta);
    });
  }

  static append_tspans(container, meta) {
    meta.forEach((m) => {
      container.append('tspan')
        .attr('x', (d) => d.x_for_text())
        .attr('dy', (d) => d.tspan_offset)
        .attr('class', m.class)
        .text(m.value);
    });
  }

  static append_image(container) {
    d3.select(container).attr('class', 'node image')
      .append('image')
      .attr('xlink:href', (d) => d.icon)
      .attr('width', (d) => d.node_width())
      .attr('height', (d) => d.node_height());
  }

  static append_rect(container) {
    d3.select(container).attr('class', 'node rect')
      .append('rect')
      .attr('width', (d) => d.node_width())
      .attr('height', (d) => d.node_height())
      .attr('rx', 5)
      .attr('ry', 5)
      .style('fill', (d) => d.color());
  }

  static tick(container) {
    container.attr('transform', (d) => d.transform());
  }
}

module.exports = Node;
