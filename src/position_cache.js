const crypto = require('crypto');

class PositionCache {
  constructor(group, node, link, data, sha1) {
    this.group = group;
    this.node = node;
    this.link = link;
    this.data = data;
    this.cached_sha1 = sha1;
  }

  save() {
    const cache = {
      sha1: this.sha1(),
      group: this.group_position(),
      node:  this.node_position(),
      link:  this.link_position()
    };

    localStorage.setItem('position_cache', JSON.stringify(cache));
  }

  sha1(data) {
    data = data || this.data;
    const sha1 = crypto.createHash('sha1');
    sha1.update(JSON.stringify(data));
    return sha1.digest('hex');
  }

  group_position() {
    const position = [];

    this.group.each((d) => {
      position.push({
        x: d.bounds.x,
        y: d.bounds.y,
        width: d.bounds.width(),
        height: d.bounds.height()
      });
    });

    return position;
  }

  node_position() {
    const position = [];

    this.node.each((d) => {
      position.push({
        x: d.x,
        y: d.y
      });
    });

    return position;
  }

  link_position() {
    const position = [];

    this.link.each((d) => {
      position.push({
        x1: d.source.x,
        y1: d.source.y,
        x2: d.target.x,
        y2: d.target.y
      });
    });

    return position;
  }

  match(data) {
    return this.cached_sha1 === this.sha1(data);
  }

  static load() {
    const cache = JSON.parse(localStorage.getItem('position_cache'));
    if (cache) {
      return new PositionCache(cache.group, cache.node, cache.link, null, cache.sha1);
    } else {
      return new PositionCache();
    }
  }
}

module.exports = PositionCache;
