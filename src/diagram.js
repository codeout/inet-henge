import Group from './group';
import Link from './link';
import Node from './node';
import PositionCache from './position_cache';
import './hack_cola';

class Diagram {
  constructor(container, url, options) {
    options = options || {};

    this.options = {};
    this.options.selector = container;
    this.options.url = url;
    this.options.group_pattern = options.pop;
    this.options.width = options.width || 960;
    this.options.height = options.height || 600;

    this.options.color = d3.scale.category20();
    this.options.max_ticks = options.ticks || 1000;
    this.options.position_cache = 'positionCache' in options ? options.positionCache : true;
    this.options.bundle = 'bundle' in options ? options.bundle : false;

    this.set_distance = this.link_distance(options.distance || 150);
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
    this.options.meta = meta;
    this.cola = this.init_cola();
    this.svg = this.init_svg();

    this.render();
  }

  init_cola() {
    return cola.d3adaptor()
      .avoidOverlaps(true)
      .handleDisconnected(false)
      .size([this.options.width, this.options.height]);
  }

  init_svg() {
    const container = d3.select(this.options.selector).append('svg')
      .attr('width', this.options.width)
      .attr('height', this.options.height)
      .append('g')
      .call(
        d3.behavior.zoom().on('zoom', () => this.zoom_callback(container))
      ).append('g');

    container.append('rect')
      .attr('width', this.options.width * 10)   // 10 is huge enough
      .attr('height', this.options.height * 10)
      .attr('transform', `translate(-${this.options.width * 5}, -${this.options.height * 5})`)
      .style('opacity', 0);

    return container;
  }

  url() {
    if (this.unique_url) {
      return this.unique_url;
    }

    this.unique_url = `${this.options.url}?${new Date().getTime()}`;
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
        const nodes = data.nodes ?
          data.nodes.map((n, i) => new Node(n, i, this.options.meta, this.options.color)) : [];
        const links = data.links ?
          data.links.map((l, i) => new Link(l, i, this.options.meta, this.get_link_width)) : [];
        const groups = Group.divide(nodes, this.options.group_pattern, this.options.color);

        this.cola.nodes(nodes)
          .links(links)
          .groups(groups);
        this.set_distance(this.cola);
        this.cola.start();

        var link, path, label;
        const group = Group.render(this.svg, groups).call(
          this.cola.drag()
            .on('dragstart', this.dragstart_callback)
            .on('drag', (d) => {
              if (this.options.bundle) {
                Link.shift_bundle(link, path, label);
              }
            })
        );
        [link, path, label] = Link.render_links(this.svg, links);
        const node = Node.render(this.svg, nodes).call(
          this.cola.drag()
            .on('dragstart', this.dragstart_callback)
            .on('drag', (d) => {
              if (this.options.bundle) {
                Link.shift_bundle(link, path, label);
              }
            })
        );

        // without path calculation
        this.configure_tick(group, node, link);

        this.position_cache = PositionCache.load(data, this.options.group_pattern);
        if (this.options.position_cache && this.position_cache) {
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

        this.cola.start();
        if (this.options.bundle) {
          Link.shift_bundle(link, path, label);
        }

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
    count = count || this.options.max_ticks;

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
    if (!this.initial_translate) {
      const transform = d3.transform(this.svg.attr('transform'));  // FIXME: This is valid only for d3.js v3
      this.initial_scale = transform.scale[0];  // NOTE: Assuming ky = kx
      this.initial_translate = transform.translate;
    }

    d3.event.scale *= this.initial_scale;
    d3.event.translate[0] += this.initial_translate[0];
    d3.event.translate[1] += this.initial_translate[1];

    Link.zoom(d3.event.scale);
    container.attr('transform', `translate(${d3.event.translate}) scale(${d3.event.scale})`);
  }

  dragstart_callback() {
    d3.event.sourceEvent.stopPropagation();
  }

  display_load_message() {
    this.indicator = this.svg.append('text')
      .attr('x', this.options.width / 2)
      .attr('y', this.options.height / 2)
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

  save_position(group, node, link) {
    this.position_cache.save(group, node, link);
  }
}

module.exports = window.Diagram = Diagram;
