import * as crypto from 'crypto';

const cloneDeep = require('lodash.clonedeep')  // eslint-disable-line @typescript-eslint/no-var-requires

import {Group} from './group';
import {InetHengeDataType} from './diagram'
import {Link} from './link';
import {Node} from './node';

export type GroupPosition = { x: number, y: number, width: number, height: number }
export type NodePosition = { x: number, y: number }
export type LinkPosition = { x1: number, y1: number, x2: number, y2: number }
type ExtendedInetHengeDataType = InetHengeDataType & { pop: string }
type CacheDataType = {
    sha1: string,
    group: GroupPosition[],
    node: NodePosition[],
    link: LinkPosition[],
}

export class PositionCache {
    private cached_sha1: string
    public group: GroupPosition[]
    public node: NodePosition[]
    public link: LinkPosition[]

    constructor(public data: InetHengeDataType, public pop?: RegExp, sha1?: string) {
        // NOTE: properties below can be undefined
        this.cached_sha1 = sha1;
    }

    static get_all(): CacheDataType[] {
        return JSON.parse(localStorage.getItem('position_cache')) || {};
    }

    static get(): CacheDataType {
        return this.get_all()[location.pathname] || {};
    }

    save(group: d3.Selection<Group>, node: d3.Selection<Node>, link: d3.Selection<Link>): void {
        const cache = PositionCache.get_all();
        cache[location.pathname] = {
            sha1: this.sha1(),
            group: this.group_position(group),
            node: this.node_position(node),
            link: this.link_position(link)
        };

        localStorage.setItem('position_cache', JSON.stringify(cache));
    }

    sha1(data?: ExtendedInetHengeDataType, pop?: RegExp): string {
        data = <ExtendedInetHengeDataType>cloneDeep(data || this.data);
        data.pop = String(pop || this.pop);
        if (data.pop === 'undefined') {
            data.pop = 'null'; // NOTE: unify undefined with null
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

    group_position(group: d3.Selection<any>): GroupPosition[] {  // eslint-disable-line @typescript-eslint/no-explicit-any
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

    node_position(node: d3.Selection<any>): NodePosition[] {  // eslint-disable-line @typescript-eslint/no-explicit-any
        const position = [];

        node.each((d: Node) => {
            position.push({
                x: d.x,
                y: d.y
            });
        });

        return position;
    }

    link_position(link: d3.Selection<any>): LinkPosition[] {  // eslint-disable-line @typescript-eslint/no-explicit-any
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
        return this.cached_sha1 === this.sha1(<ExtendedInetHengeDataType>data, pop);
    }

    static load(data: InetHengeDataType, pop: RegExp): PositionCache | undefined {
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
