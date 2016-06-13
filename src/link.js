import MetaData from './meta_data'
import Node from './node'

class Link {
  constructor(data, id, meta_keys) {
    this.id = id
    this.source = Node.id_by_name(data.source)
    this.target = Node.id_by_name(data.target)
    this.source_meta = new MetaData(data.meta, 'source').slice(meta_keys)
    this.target_meta = new MetaData(data.meta, 'target').slice(meta_keys)

    this.init()
  }

  init() {
    this.label_x_offset = 30
    this.label_y_offset = '1.1em'
  }

  is_reverse_path() {
    return this.target_meta.length>0
  }

  d() {
    return `M ${this.source.x} ${this.source.y} L ${this.target.x} ${this.target.y}`
  }

  path_id() {
    return `path${this.id}`
  }

  // OPTIMIZE: Implement better right-alignment of the path, especially for multi tspans
  tspan_x_offset() {
    if(this.is_reverse_path())
      return -this.label_x_offset
    else
      return this.label_x_offset
  }

  split() {
    if(this.source_meta && this.target_meta) {
      const source = Object.assign(Object.create(this), this)
      const target = Object.assign(Object.create(this), this)
      source.target_meta = []
      target.source_meta = []
      return [source, target]
    }

    return [this]
  }

  has_meta() {
    return this.source_meta.length > 0 || this.target_meta.length > 0
  }

  static render_links(svg, links) {
    return svg.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', (d)=> d.source.x)
      .attr('y1', (d)=> d.source.y)
      .attr('x2', (d)=> d.target.x)
      .attr('y2', (d)=> d.target.y)
  }

  static render_paths(svg, links) {
    const labelled_links = links.filter((l)=> l.has_meta())
    const paths = Link.create_paths(svg, labelled_links)

    const split_labelled_links = Array.prototype.concat.apply([], labelled_links.map((l)=> l.split()))
          .filter((l)=> l.has_meta())
    this.create_labels(svg, split_labelled_links)

    return paths
  }

  static create_paths(svg, links) {
    return svg.selectAll(".path")
      .data(links)
      .enter()
      .append('path')
      .attr('d', (d)=> d.d())
      .attr('id', (d)=> d.path_id())
  }

  static create_labels(svg, links) {
    const text_path = svg.selectAll(".path-label")
          .data(links)
          .enter()
          .append('text')
          .attr('class', 'path-label')
          .attr('pointer-events', 'none')
          .append('textPath')
          .attr('xlink:href', (d)=> `#${d.path_id()}`)

    text_path.each(function(d) {
      Link.append_tspans(this, d.source_meta)
      Link.append_tspans(this, d.target_meta)

      if(d.is_reverse_path())
        Link.the_other_end(this)
    })
  }

  static the_other_end(container) {
    d3.select(container)
      .attr('class', 'reverse')
      .attr('text-anchor', 'end')
      .attr('startOffset', '100%')
  }

  static append_tspans(container, meta) {
    meta.forEach((m, i)=> {
      d3.select(container).append('tspan')
        .attr('x', (d)=> d.tspan_x_offset())
        .attr('dy', (d)=> d.label_y_offset)
        .attr('class', m.class)
        .text(m.value)
    })
  }

  static tick(link, path) {
    link.attr('x1', (d)=> d.source.x)
      .attr('y1', (d)=> d.source.y)
      .attr('x2', (d)=> d.target.x)
      .attr('y2', (d)=> d.target.y)

    path.attr('d', (d)=> d.d())
  }
}

module.exports = Link
