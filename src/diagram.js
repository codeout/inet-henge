import Group from './group';
import Link from './link';
import Node from './node';
import PositionCache from './position_cache';
import './hack_cola';

class Diagram {
  constructor(container, url, options) {
    options = options || {};

    this.selector = container;
    this.original_url = url;
    this.group_pattern = options.pop;
    this.width = options.width || 960;
    this.height = options.height || 600;

    this.set_distance = this.link_distance(options.distance || 150);
    this.color = d3.scale.category20();
    this.max_ticks = options.ticks || 1000;
    this.position_cache = 'positionCache' in options ? options.positionCache : true;
  }

  link_distance(distance) {
    if (typeof distance === 'function')
      return distance;
    else
      return (cola) => cola.linkDistance(distance);
  }

  link_width(func) {
    this.get_link_width = func;
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

  url() {
    if (this.unique_url) {
      return this.unique_url;
    }

    this.unique_url = `${this.original_url}?${new Date().getTime()}`;
    return this.unique_url;
  }

  render() {
    this.display_load_message();

    d3.json(this.url(), (error, data) => {
      if (error) {
        console.error(error);
        this.show_message(`Failed to load "${this.url()}"`);
      }

      try {
        const nodes = data.nodes ? data.nodes.map((n, i) => new Node(n, i, this.meta, this.color)) : [];
        const links = data.links ? data.links.map((l, i) => new Link(l, i, this.meta, this.get_link_width))
          : [];
        const groups = Group.divide(nodes, this.group_pattern, this.color);

        this.cola.nodes(nodes)
          .links(links)
          .groups(groups);
        this.set_distance(this.cola);
        this.cola.start();

        const group = Group.render(this.svg, groups).call(
          this.cola.drag().on('dragstart', this.dragstart_callback)
        );
        const [link, path, label] = Link.render_links(this.svg, links);
        const node = Node.render(this.svg, nodes).call(
          this.cola.drag().on('dragstart', this.dragstart_callback)
        );

        // without path calculation
        this.configure_tick(group, node, link);

        const position = PositionCache.load();
        if (this.position_cache && position.match(data, this.pop)) {
          Group.set_position(group, position.group);
          Node.set_position(node, position.node);
          Link.set_position(link, position.link);
        } else {
          this.ticks_forward();
          this.save_position(group, node, link, data, this.pop);
        }

        this.hide_load_message();

        // render path
        this.configure_tick(group, node, link, path, label);
        this.cola.start();
        this.ticks_forward(1);

        path.attr('d', (d) => d.d());  // make sure path calculation is done
        this.freeze(node);
      } catch (e) {
        this.show_message(e);
        throw e;
      }
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

  show_message(message) {
    if (this.indicator)
      this.indicator.text(message);
  }

  save_position(group, node, link, data, pop) {
    const cache = new PositionCache(group, node, link, data, pop);
    cache.save();
  }
}

module.exports = window.Diagram = Diagram;
