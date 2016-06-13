import Group from './group'
import Link from './link'
import Node from './node'

class Diagram {
  constructor(url, pattern, width, height) {
    this.url = url
    this.group_pattern = pattern
    this.width = width
    this.height = height
  }

  init(...meta) {
    this.color = d3.scale.category20()
    this.meta = meta
    this.ticks = 100
    this.cola = this.init_cola()
    this.svg = this.init_svg()

    this.render()
  }

  init_cola() {
    return cola.d3adaptor()
      .linkDistance(100)
      .avoidOverlaps(true)
      .handleDisconnected(false)
      .size([this.width, this.height])
  }

  init_svg() {
    return d3.select('body').append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
  }

  render() {
    d3.json(this.url, (error, data)=> {
      if(error)
        console.error(error)

      const nodes = data.nodes.map((n, i)=> new Node(n, i, this.meta, this.color))
      const links = data.links.map((l, i)=> new Link(l, i, this.meta))
      const groups = Group.divide(nodes, this.group_pattern, this.color)

      this.cola.nodes(nodes)
        .links(links)
        .groups(groups)
        .linkDistance(150)
        .start()

      const group = Group.render(this.svg, groups).call(this.cola.drag)
      const link = Link.render_links(this.svg, links)
      const node = Node.render(this.svg, nodes).call(this.cola.drag)
      const path = Link.render_paths(this.svg, links)

      this.cola.on('tick', ()=> {
        Node.tick(node)
        Link.tick(link, path)
        Group.tick(group)
      })

      for(let i = 0; i < this.ticks; i++)
        this.cola.tick()
      this.cola.stop()
    })
  }
}

module.exports = window.Diagram = Diagram
