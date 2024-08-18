import * as d3 from "d3";

import { Link, LinkDataType } from "./link";

export class Bundle {
  // Bundle group in the whole graph
  // {
  //   "[<source node id>, <target node id>, \"<bundle id>\"]": [<link id>, ...],
  // }
  private static groups: Record<string, number[]>;

  // member Links of this Bundle
  protected readonly links: Link[];

  private color: string;
  private width: number;
  private space: number;
  private _shiftMultiplier: number;

  constructor(
    links: Link[],
    public id: number,
  ) {
    this.links = links;
    this.color = "#7a4e4e";
    this.width = 2;
    this.space = 4;
  }

  static divide(links: Link[]) {
    Bundle.groups = {};

    for (const l of links) {
      if (l.bundle) {
        const key = this.groupKey(l);
        (Bundle.groups[key] || (Bundle.groups[key] = [])).push(l.id);
      }
    }

    return Object.values(Bundle.groups).map((ids, i) => {
      return new Bundle(
        ids.map((id) => links[id]),
        i,
      );
    });
  }

  private static groupKey(link: Link) {
    return JSON.stringify([link.source, link.target, link.bundle]);
  }

  static render(
    linkLayer: d3.Selection<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    bundles: Bundle[],
  ) {
    const bundleGroup = linkLayer
      .selectAll(".bundle")
      .data(bundles)
      .enter()
      .append("g")
      .attr("class", (d) => d.class());

    const bundle = bundleGroup
      .append("path")
      .attr("d", (d) => d.d())
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", (d) => d.width)
      .attr("fill", "none")
      .attr("id", (d) => d.bundleId());

    return bundle;
  }

  static reset() {
    Bundle.groups = null;
  }

  // sort by bundle with preserving order
  static sortByBundle(links: LinkDataType[]) {
    return links.sort((a, b) => {
      switch (true) {
        case !!a.bundle && !b.bundle:
          return -1;
        case !a.bundle && !!b.bundle:
          return 1;
        case !a.bundle && !b.bundle:
          return 0;

        // !!a.bundle && !!b.bundle === true
        case a.bundle.toString() < b.bundle.toString():
          return -1;
        case a.bundle.toString() > b.bundle.toString():
          return 1;

        default:
          return 0;
      }
    });
  }

  d() {
    const first = this.links[0].centerCoordinates();
    const last = this.links[this.links.length - 1].centerCoordinates();
    const gap = Math.sqrt(Math.pow(first[0] - last[0], 2) + Math.pow(first[1] - last[1], 2));

    if (gap === 0) {
      return "";
    }

    const angle = this.links[0].angle() + 90;
    const start = [
      ((first[0] - last[0]) * this.space) / gap + first[0],
      ((first[1] - last[1]) * this.space) / gap + first[1],
    ];
    const end = [
      ((last[0] - first[0]) * this.space) / gap + last[0],
      ((last[1] - first[1]) * this.space) / gap + last[1],
    ];

    return `M ${start[0]} ${start[1]} A ${gap / 2 + 10},5 ${angle} 1,0 ${end[0]} ${end[1]}`;
  }

  private shiftMultiplier() {
    if (!this._shiftMultiplier) {
      const members = this.links[0].group() || [];
      this._shiftMultiplier = this.links.reduce((sum, l) => (sum += l.id - (members.length - 1) / 2), 0) / 2;
    }

    return this._shiftMultiplier;
  }

  static shiftBundle(bundle: d3.Selection<Bundle>) {
    bundle.attr("d", (d) => d.d());
  }

  private class() {
    // modified link's class
    return this.links[0].class().replace(/^link/, "bundle");
  }

  private bundleId() {
    return `bundle${this.id}`;
  }
}
