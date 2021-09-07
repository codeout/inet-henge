const cloneDeep = require("lodash.clonedeep");  // eslint-disable-line @typescript-eslint/no-var-requires
const md5 = require("md5");  // eslint-disable-line @typescript-eslint/no-var-requires

import { InetHengeDataType } from "./diagram";
import { Group } from "./group";
import { Link } from "./link";
import { Node } from "./node";

export type GroupPosition = { x: number, y: number, width: number, height: number }
export type NodePosition = { x: number, y: number }
export type LinkPosition = { x1: number, y1: number, x2: number, y2: number }
type ExtendedInetHengeDataType = InetHengeDataType & { pop: string }
type CacheDataType = {
  md5: string,
  group: GroupPosition[],
  node: NodePosition[],
  link: LinkPosition[],
}

export class PositionCache {
  private cachedMd5: string;
  public group: GroupPosition[];
  public node: NodePosition[];
  public link: LinkPosition[];

  constructor(public data: InetHengeDataType, public pop?: RegExp, md5?: string) {
    // NOTE: properties below can be undefined
    this.cachedMd5 = md5;
  }

  static getAll(): {[key: string]: CacheDataType} {
    return JSON.parse(localStorage.getItem("positionCache")) || {};
  }

  static get(): CacheDataType {
    return this.getAll()[location.pathname] || {} as CacheDataType;
  }

  save(group: d3.Selection<Group>, node: d3.Selection<Node>, link: d3.Selection<Link>): void {
    const cache = PositionCache.getAll();
    cache[location.pathname] = {
      md5: this.md5(),
      group: this.groupPosition(group),
      node: this.nodePosition(node),
      link: this.linkPosition(link)
    };

    localStorage.setItem("positionCache", JSON.stringify(cache));
  }

  md5(data?: ExtendedInetHengeDataType, pop?: RegExp): string {
    data = cloneDeep(data || this.data) as ExtendedInetHengeDataType;
    data.pop = String(pop || this.pop);
    if (data.pop === "undefined") {
      data.pop = "null"; // NOTE: unify undefined with null
    }

    data.nodes && data.nodes.forEach((i) => {
      delete i.icon;
      delete i.meta;
    });
    data.links && data.links.forEach((i) => {
      delete i.meta;
    });

    return md5(JSON.stringify(data));
  }

  groupPosition(group: d3.Selection<any>): GroupPosition[] {  // eslint-disable-line @typescript-eslint/no-explicit-any
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

  nodePosition(node: d3.Selection<any>): NodePosition[] {  // eslint-disable-line @typescript-eslint/no-explicit-any
    const position = [];

    node.each((d: Node) => {
      position.push({
        x: d.x,
        y: d.y
      });
    });

    return position;
  }

  linkPosition(link: d3.Selection<any>): LinkPosition[] {  // eslint-disable-line @typescript-eslint/no-explicit-any
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

  match(data: InetHengeDataType, pop: RegExp): boolean {
    return this.cachedMd5 === this.md5(data as ExtendedInetHengeDataType, pop);
  }

  static load(data: InetHengeDataType, pop: RegExp): PositionCache | undefined {
    const cache = this.get();
    if (cache) {
      const position = new PositionCache(data, pop, cache.md5);
      if (position.match(data, pop)) { // if data and pop match saved md5
        position.group = cache.group;
        position.node = cache.node;
        position.link = cache.link;

        return position;
      }
    }
  }
}
