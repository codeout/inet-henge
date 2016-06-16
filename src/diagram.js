import Group from './group';
import Link from './link';
import Node from './node';

class Diagram {
  constructor(container, url, options) {
    options = options || {};

    this.selector = container;
    this.url = url;
    this.group_pattern = options.pop || /^([^\s-]+)-/;
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

    return container;
  }

  render() {
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
      this.ticks_forward(this.max_ticks);

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
}

module.exports = window.Diagram = Diagram;
