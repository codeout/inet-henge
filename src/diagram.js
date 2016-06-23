import Group from './group';
import Link from './link';
import Node from './node';

class Diagram {
  constructor(container, url, options) {
    options = options || {};

    this.selector = container;
    this.url = url;
    this.group_pattern = options.pop;
    this.width = options.width || 960;
    this.height = options.height || 600;

    this.set_distance = this.link_distance(options.distance || 150);
    this.color = d3.scale.category20();
    this.max_ticks = 1000;
  }

  link_distance(distance) {
    if (typeof distance == 'function')
      return distance;
    else
      return (cola) => cola.linkDistance(distance);
  }

  init(...meta) {
    this.meta = meta;
    this.cola = this.init_cola();
    this.svg = this.init_svg();

    this.render();
  }

  init_cola() {
    return cola.d3adaptor()
      .avoidOverlaps(true)
      .handleDisconnected(false)
      .size([this.width, this.height]);
  }

  init_svg() {
    const container = d3.select(this.selector).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .call(
        d3.behavior.zoom().on('zoom', () => this.zoom_callback(container))
      ).append('g');

    container.append('rect')
      .attr('width', this.width * 10)   // 10 is huge enough
      .attr('height', this.height * 10)
      .attr('transform', `translate(-${this.width * 5}, -${this.height * 5})`)
      .style('opacity', 0);

    return container;
  }

  render() {
    this.display_load_message();

    d3.json(this.url, (error, data) => {
      if (error)
        console.error(error);

      const nodes = data.nodes.map((n, i) => new Node(n, i, this.meta, this.color));
      const links = data.links.map((l, i) => new Link(l, i, this.meta));
      const groups = Group.divide(nodes, this.group_pattern, this.color);

      this.cola.nodes(nodes)
        .links(links)
        .groups(groups);
      this.set_distance(this.cola);
      this.cola.start();

      const group = Group.render(this.svg, groups).call(
        this.cola.drag().on('dragstart', this.dragstart_callback)
      );
      const link = Link.render_links(this.svg, links);
      const node = Node.render(this.svg, nodes).call(
        this.cola.drag().on('dragstart', this.dragstart_callback)
      );
      const [path, label] = Link.render_paths(this.svg, links);

      // without path calculation
      this.configure_tick(group, node, link);
      this.ticks_forward();
      this.hide_load_message();

      // render path
      this.configure_tick(group, node, link, path, label);
      this.cola.start();
      this.ticks_forward(1);

      this.freeze(node);
    });
  }

  configure_tick(group, node, link, path, label) {
    this.cola.on('tick', () => {
      Node.tick(node);
      Link.tick(link, path, label);
      Group.tick(group);
    });
  }

  ticks_forward(count) {
    count = count || this.max_ticks;

    for (let i = 0; i < count; i++)
      this.cola.tick();
    this.cola.stop();
  }

  freeze(container) {
    container.each((d) => d.fixed = true);
  }

  destroy() {
    d3.select('body svg').remove();
  }

  zoom_callback(container) {
    Link.zoom(d3.event.scale);
    container.attr('transform', `translate(${d3.event.translate}) scale(${d3.event.scale})`);
  }

  dragstart_callback() {
    d3.event.sourceEvent.stopPropagation();
  }

  display_load_message() {
    this.indicator = this.svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height / 2)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text('Simulating. Just a moment ...');
  }

  hide_load_message() {
    if (this.indicator)
      this.indicator.remove();
  }
}

module.exports = window.Diagram = Diagram;
