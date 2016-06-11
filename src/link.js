import Node from './node'

class Link {
  constructor(data) {
    this.source = Node.id_by_name(data.source)
    this.target = Node.id_by_name(data.target)
  }

  static render(svg, links) {
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

  static tick(link) {
    link.attr('x1', (d)=> d.source.x)
      .attr('y1', (d)=> d.source.y)
      .attr('x2', (d)=> d.target.x)
      .attr('y2', (d)=> d.target.y)
  }
}

module.exports = Link
