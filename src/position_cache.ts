import * as crypto from 'crypto';

export class PositionCache {
  cached_sha1
  group
  node
  link

  constructor(public data, public pop?, sha1?) {
    // NOTE: properties below can be undefined
    this.cached_sha1 = sha1;
  }

  static get_all() {
    return JSON.parse(localStorage.getItem('position_cache')) || {};
  }

  static get() {
    return this.get_all()[location.pathname] || {};
  }

  save(group, node, link) {
    const cache = PositionCache.get_all();
    cache[location.pathname] = {
      sha1: this.sha1(),
      group: this.group_position(group),
      node: this.node_position(node),
      link: this.link_position(link)
    };

    localStorage.setItem('position_cache', JSON.stringify(cache));
  }

  sha1(data?, pop?) {
    data = Object.assign({}, data || this.data);
    data.pop = pop || this.pop;
    if (data.pop) {
      data.pop = data.pop.toString();
    } else {
      data.pop = null; // NOTE: unify undefined with null
    }

    data.nodes && data.nodes.forEach((i) => {
      delete i.icon;
      delete i.meta;
    });
    data.links && data.links.forEach((i) => {
      delete i.meta;
    });

    const sha1 = crypto.createHash('sha1');
    sha1.update(JSON.stringify(data));
    return sha1.digest('hex');
  }

  group_position(group) {
    const position = [];

    group.each((d) => {
      position.push({
        x: d.bounds.x,
        y: d.bounds.y,
        width: d.bounds.width(),
        height: d.bounds.height()
      });
    });

    return position;
  }

  node_position(node) {
    const position = [];

    node.each((d) => {
      position.push({
        x: d.x,
        y: d.y
      });
    });

    return position;
  }

  link_position(link) {
    const position = [];

    link.each((d) => {
      position.push({
        x1: d.source.x,
        y1: d.source.y,
        x2: d.target.x,
        y2: d.target.y
      });
    });

    return position;
  }

  match(data, pop) {
    return this.cached_sha1 === this.sha1(data, pop);
  }

  static load(data, pop) {
    const cache = this.get();
    if (cache) {
      const position = new PositionCache(data, pop, cache.sha1);
      if (position.match(data, pop)) { // if data and pop match saved sha1
        position.group = cache.group;
        position.node = cache.node;
        position.link = cache.link;

        return position;
      }
    }
  }
}
