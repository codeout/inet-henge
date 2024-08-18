export type MetaDataType = { class: string; value: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

export class MetaData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(
    private data: Record<string, any>,
    private extraKey?: string,
  ) {}

  get(keys: string[]) {
    return this.slice(keys).filter((k) => typeof k.value === "string");
  }

  private slice(keys: string[]) {
    if (!this.data) return [];

    if (this.extraKey) return this.sliceWithExtraKey(keys);
    else return this.sliceWithoutExtraKey(keys);
  }

  private sliceWithExtraKey(keys: string[]) {
    const data: MetaDataType[] = [];

    keys.forEach((k) => {
      if (this.data[k] && this.data[k][this.extraKey]) data.push({ class: k, value: this.data[k][this.extraKey] });
    });

    return data;
  }

  private sliceWithoutExtraKey(keys: string[]) {
    const data: MetaDataType[] = [];

    keys.forEach((k) => {
      if (this.data[k]) data.push({ class: k, value: this.data[k] });
    });

    return data;
  }
}
