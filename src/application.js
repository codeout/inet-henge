class Diagram {
  constructor(url, pattern, width, height) {
    this.url = url
    this.pop_pattern = pattern
    this.width = width
    this.height = height
  }

  init() {
    this.color = d3.scale.category20()
    this.cola = this.init_cola()
    this.svg = this.init_svg()
    this.node_width = 60
    this.node_height = 40
    this.padding = 3

    this.process_data(this.url, (graph)=> {
      this.render(graph)
    })
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

  process_data(url, callback) {
    d3.json(url, (error, data)=> {
      if(error)
        console.error(error)

      set_default_values(data.nodes)

      data.links.forEach(function(d) {
        d.source = resolve_name(d.source, data.nodes)
        d.target = resolve_name(d.target, data.nodes)
      })

      data.groups = this.pop_groups(data.nodes)

      callback(data)
    })

    const set_default_values = (objects)=> {
      objects.forEach((d, i)=> {
        d.id = i
        d.width = this.node_width
        d.height = this.node_height
      })
    }

    const resolve_name = (name, objects)=> {
      if(!this._map)
        this._map = d3.map(objects, (d)=> d.name)

      return this._map.get(name).id
    }
  }

  pop_groups(nodes) {
    let pops = {}
    const make_groups = (objects)=> {
      return Object.keys(objects).map((v)=> {
        return {leaves: objects[v], name: v}
      })
    }

    nodes.forEach((d)=> {
      const result = d.name.match(this.pop_pattern)

      if(!pops[result[0]])
        pops[result[0]] = []

      pops[result[0]].push(d.id)
    })

    return make_groups(pops)
  }

  render(data) {
    this.calculate(data)

    const group = this.render_group(data)
    const link = this.render_link(data)
    const node = this.render_node(data)

    this.cola.on('tick', ()=> {
      node.attr('transform', (d)=> {
        const x = d.x - d.width / 2 + this.padding
        const y = d.y - d.height / 2 + this.padding
        return `translate(${x}, ${y})`
      })

      link.attr('x1', (d)=> d.source.x)
        .attr('y1', (d)=> d.source.y)
        .attr('x2', (d)=> d.target.x)
        .attr('y2', (d)=> d.target.y)

      group.attr('transform', (d)=> `translate(${d.bounds.x}, ${d.bounds.y})`)
      group.selectAll('rect')
        .attr('width', (d)=> d.bounds.width())
        .attr('height', (d)=> d.bounds.height())
    })
  }

  render_node(data) {
    const add_rect = (node)=> {
      d3.select(node).append('rect')
        .attr('width', (d)=> d.width - 2 * this.padding)
        .attr('height', (d)=> d.height - 2 * this.padding)
        .attr('rx', 5)
        .attr('ry', 5)
        .style('fill', (d)=> this.color(data.groups.length))
    }

    const add_image = (node)=> {
      d3.select(node).append('image')
        .attr('xlink:href', (d)=> d.url)
        .attr('width', (d)=> d.width - 2 * this.padding)
        .attr('height', (d)=> d.height - 2 * this.padding)
        .attr('rx', 5)
        .attr('ry', 5)
        .style('fill', (d)=> this.color(data.groups.length))
    }

    const add_text = (node)=> {
      d3.select(node).append('text')
        .text((d)=> d.name)
        .attr('text-anchor', 'middle')
        .attr('x', this.node_width/2)
        .attr('y', this.node_height/2)
    }

    const node = this.svg.selectAll('.node')
          .data(data.nodes)
          .enter()
          .append('g')
          .attr('class', 'node')
          .attr('transform', (d)=> {
            const x = d.x - d.width / 2 + this.padding
            const y = d.y - d.height / 2 + this.padding
            return `translate(${x}, ${y})`
          })
          .call(this.cola.drag)

    node.each(function(d) {
      if(d.url) {
        add_image(this)
      } else {
        add_rect(this)
      }

      add_text(this)
    })

    return node
  }

  render_link(data) {
    return this.svg.selectAll('.link')
      .data(data.links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', (d)=> d.source.x)
      .attr('y1', (d)=> d.source.y)
      .attr('x2', (d)=> d.target.x)
      .attr('y2', (d)=> d.target.y)
  }

  render_group(data) {
    const group = this.svg.selectAll('.group')
          .data(data.groups)
          .enter()
          .append('g')
          .attr('class', 'group')
          .attr('transform', (d)=> { return `translate(${d.bounds.x}, ${d.bounds.y})`})
          .call(this.cola.drag)

    group.append('rect')
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('width', (d)=> d.bounds.width())
      .attr('height', (d)=> d.bounds.height())
      .style('fill', (d, i)=> this.color(i))

    group.append('text')
      .text((d)=> d.name)

    return group
  }

  calculate(data) {
    this.cola.nodes(data.nodes)
      .links(data.links)
      .groups(data.groups)
      .start()

    for(let i = 0; i < 10000; i++)
      this.cola.tick()
    this.cola.stop()
  }
}

new Diagram('data.json', /^POP\d+/, 960, 600).init()
