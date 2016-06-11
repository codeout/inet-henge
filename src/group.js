class Group {
  constructor(name, color) {
    this.name = name
    this.color = color
    this.leaves = []
  }

  push(node) {
    this.leaves.push(node.id)
  }

  transform() {
    return `translate(${this.bounds.x}, ${this.bounds.y})`
  }

  group_width() {
    return this.bounds.width()
  }

  group_height() {
    return this.bounds.height()
  }

  static divide(nodes, pattern, color) {
    let groups = {}

    nodes.forEach((node)=> {
      const result = node.name.match(pattern)

      if(!groups[result[0]])
        groups[result[0]] = new Group(result[0], color)

      groups[result[0]].push(node)
    })

    return this.array(groups)
  }

  static array(groups) {
    return Object.keys(groups).map((g)=> groups[g])
  }

  static render(svg, groups) {
    const group = svg.selectAll('.group')
          .data(groups)
          .enter()
          .append('g')
          .attr('class', 'group')
          .attr('transform', (d)=> d.transform())

    group.append('rect')
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('width', (d)=> d.group_width())
      .attr('height', (d)=> d.group_height())
      .style('fill', (d, i)=> d.color(i))

    group.append('text')
      .text((d)=> d.name)

    return group
  }

  static tick(group) {
    group.attr('transform', (d)=> d.transform())
    group.selectAll('rect')
      .attr('width', (d)=> d.group_width())
      .attr('height', (d)=> d.group_height())
  }
}

module.exports = Group
