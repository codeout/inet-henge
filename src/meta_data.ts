export type MetaDataType = { class: string; value: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

export class MetaData {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private data: Record<string, any>,
    private extraKey?: string,
  ) {}

  get(keys: string[]) {
    return this.slice(keys).filter((k) => typeof k.value === "string");
  }

  private slice(keys: string[]) {
    if (!this.data) return [];

    return this.extraKey ? this.sliceWithExtraKey(keys) : this.sliceWithoutExtraKey(keys);
  }

  private sliceWithExtraKey(keys: string[]) {
    const data: MetaDataType[] = [];
    const extraKey = this.extraKey as string;

    for (const k of keys) {
      if (this.data[k] && this.data[k][extraKey]) data.push({ class: k, value: this.data[k][extraKey] });
    }

    return data;
  }

  private sliceWithoutExtraKey(keys: string[]) {
    const data: MetaDataType[] = [];

    for (const k of keys) {
      if (this.data[k]) data.push({ class: k, value: this.data[k] });
    }

    return data;
  }
}
