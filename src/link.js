import MetaData from './meta_data';
import Node from './node';
import {classify} from './util';

class Link {
  constructor(data, id, meta_keys, link_width) {
    this.id = id;
    this.source = Node.id_by_name(data.source);
    this.target = Node.id_by_name(data.target);
    this.meta = new MetaData(data.meta).get(meta_keys);
    this.source_meta = new MetaData(data.meta, 'source').get(meta_keys);
    this.target_meta = new MetaData(data.meta, 'target').get(meta_keys);
    this.extra_class = data.class || '';

    if (typeof link_width === 'function')
      this.width = link_width(data.meta) || 3;
    else
      this.width = link_width || 3;

    this.default_margin = 15;
    this.label_x_offset = 20;
    this.label_y_offset = 1.5; // em
    this.color = '#7a4e4e';

    this.register(id, this.source, this.target);
  }

  is_named_path() {
    return this.meta.length > 0;
  }

  is_reverse_path() {
    return this.target_meta.length > 0;
  }

  d() {
    return `M ${this.source.x} ${this.source.y} L ${this.target.x} ${this.target.y}`;
  }

  path_id() {
    return `path${this.id}`;
  }

  link_id() {
    return `link${this.id}`;
  }

  margin() {
    if (!this._margin) {
      const margin = window.getComputedStyle(document.getElementById(this.link_id())).margin;

      // NOTE: Assuming that window.getComputedStyle() returns some value link "10px"
      // or "0px" even when not defined in .css
      if (!margin || margin === '0px') {
        this._margin = this.default_margin;
      } else {
        this._margin = parseInt(margin);
      }
    }

    return this._margin;
  }

  // OPTIMIZE: Implement better right-alignment of the path, especially for multi tspans
  tspan_x_offset() {
    if (this.is_named_path())
      return 0;
    else if (this.is_reverse_path())
      return -this.label_x_offset;
    else
      return this.label_x_offset;
  }

  tspan_y_offset() {
    if (this.is_named_path())
      return `${-this.label_y_offset + 0.7}em`;
    else
      return `${this.label_y_offset}em`;
  }

  rotate(bbox) {
    if (this.source.x > this.target.x)
      return `rotate(180 ${bbox.x + bbox.width / 2} ${bbox.y + bbox.height / 2})`;
    else
      return 'rotate(0)';
  }

  split() {
    if (!this.meta && !this.source_meta && !this.target_meta)
      return [this];

    const meta = [];
    ['meta', 'source_meta', 'target_meta'].forEach((key, i, keys) => {
      if (this[key]) {
        const duped = Object.assign(Object.create(this), this);

        keys.filter((k) => k !== key).forEach((k) => duped[k] = []);
        meta.push(duped);
      }
    });

    return meta;
  }

  has_meta() {
    return this.meta.length > 0 || this.source_meta.length > 0 || this.target_meta.length > 0;
  }

  class() {
    // eslint-disable-next-line max-len
    return `link ${classify(this.source.name)} ${classify(this.target.name)} ${classify(this.source.name)}-${classify(this.target.name)} ${this.extra_class}`;
  }

  static render(linkLayer, labelLayer, links) {
    // Render lines
    const pathGroup = linkLayer.selectAll('.link')
      .data(links)
      .enter()
      .append('g')
      .attr('class', (d) => d.class());

    const link = pathGroup.append('line')
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', (d) => d.width)
      .attr('id', (d) => d.link_id())
      .on('mouseover.line', (d) => textGroup.selectAll(`text.${d.path_id()}`).classed('hover', true))
      .on('mouseout.line', (d) => textGroup.selectAll(`text.${d.path_id()}`).classed('hover', false));

    const path = pathGroup.append('path')
      .attr('d', (d) => d.d())
      .attr('id', (d) => d.path_id());

    // Render texts
    const textGroup = labelLayer.selectAll('.link')
      .data(links)
      .enter()
      .append('g')
      .attr('class', (d) => d.class());

    const text = textGroup.selectAll('text')
      .data((d) => d.split().filter((l) => l.has_meta()))
      .enter()
      .append('text')
      .attr('class', (d) => d.path_id()); // Bind text with path_id as class

    const text_path = text.append('textPath')
      .attr('xlink:href', (d) => `#${d.path_id()}`);

    text_path.each(function (d) {
      Link.append_tspans(this, d.meta);
      Link.append_tspans(this, d.source_meta);
      Link.append_tspans(this, d.target_meta);

      if (d.is_named_path())
        Link.center(this);

      if (d.is_reverse_path())
        Link.the_other_end(this);
    });

    Link.zoom(); // Initialize
    return [link, path, text];
  }

  static the_other_end(container) {
    d3.select(container)
      .attr('class', 'reverse')
      .attr('text-anchor', 'end')
      .attr('startOffset', '100%');
  }

  static center(container) {
    d3.select(container)
      .attr('class', 'center')
      .attr('text-anchor', 'middle')
      .attr('startOffset', '50%');
  }

  static append_tspans(container, meta) {
    meta.forEach((m, i) => {
      d3.select(container).append('tspan')
        .attr('x', (d) => d.tspan_x_offset())
        .attr('dy', (d) => d.tspan_y_offset())
        .attr('class', m.class)
        .text(m.value);
    });
  }

  static tick(link, path, label) {
    link.attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    if (path)
      path.attr('d', (d) => d.d());
    if (label)
      label.attr('transform', function (d) {
        return d.rotate(this.getBBox());
      });
  }

  static zoom(scale) {
    let visibility = 'hidden';
    if (scale && scale > 1.5)
      visibility = 'visible';

    d3.selectAll('.link text')
      .style('visibility', visibility);
  }

  static set_position(link, position) {
    link.attr('x1', (d, i) => position[i].x1)
      .attr('y1', (d, i) => position[i].y1)
      .attr('x2', (d, i) => position[i].x2)
      .attr('y2', (d, i) => position[i].y2);
  }

  register(id, source, target) {
    Link.groups = Link.groups || {};
    const key = [source, target].sort();
    Link.groups[key] = Link.groups[key] || [];
    Link.groups[key].push(id);
  }

  static shift_multiplier(link) {
    const members = Link.groups[[link.source.id, link.target.id].sort()] || [];
    return members.indexOf(link.id) - (members.length - 1) / 2;
  }

  static shift_bundle(link, path, label) {
    const transform = (d) => d.shift_bundle(Link.shift_multiplier(d));

    link.attr('transform', transform);
    path.attr('transform', transform);
    label.attr('transform', transform);
  }

  shift_bundle(multiplier) {
    const gap = this.margin() * multiplier;

    const width = Math.abs(this.target.x - this.source.x);
    const height = Math.abs(this.source.y - this.target.y);
    const length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

    return `translate(${gap * height / length}, ${gap * width / length})`;
  }
}

module.exports = Link;
