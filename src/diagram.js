import Group from './group'
import Link from './link'
import Node from './node'

class Diagram {
  constructor(url, options) {
    options = options || {}

    this.url = url
    this.group_pattern = options.pop || /^([^\s-]+)-/
    this.width = options.width || 960
    this.height = options.height || 600

    this.distance = options.distance || 150
    this.color = d3.scale.category20()
    this.ticks = 10000
  }

  init(...meta) {
    this.meta = meta
    this.cola = this.init_cola()
    this.svg = this.init_svg()

    this.render()
  }

  init_cola() {
    return cola.d3adaptor()
      .avoidOverlaps(true)
      .handleDisconnected(false)
      .size([this.width, this.height])
  }

  init_svg() {
    const container = d3.select('body').append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .call(
        d3.behavior.zoom()
          .on('zoom', ()=> this.zoom_callback(container))
      )
      .append('g')

    return container
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
        .linkDistance(this.distance)
        .start()

      const group = Group.render(this.svg, groups).call(this.cola.drag)
      const link = Link.render_links(this.svg, links)
      const node = Node.render(this.svg, nodes).call(this.cola.drag)
      const [path, label] = Link.render_paths(this.svg, links)

      this.configure_tick(group, node, link) // without path calculation

      for(let i = 0; i < this.ticks; i++)
        this.cola.tick()
      this.cola.stop()

      // render path
      this.configure_tick(group, node, link, path, label)
      this.cola.start()
      this.cola.tick()
      this.cola.stop()
    })
  }

  configure_tick(group, node, link, path, label) {
    this.cola.on('tick', ()=> {
      Node.tick(node)
      Link.tick(link, path, label)
      Group.tick(group)
    })
  }

  destroy() {
    d3.select('body svg').remove()
  }

  zoom_callback(container) {
    Link.zoom(d3.event.scale)
    container.attr('transform', `translate(${d3.event.translate}) scale(${d3.event.scale})`)
  }
}

module.exports = window.Diagram = Diagram
