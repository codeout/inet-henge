export type MetaDataType = { class: string, value: any }  // eslint-disable-line @typescript-eslint/no-explicit-any

export class MetaData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(private data: Record<string, any>, private extraKey?: string) {
    }

    get(keys: string[]): MetaDataType[] {
        return this.slice(keys).filter((k) => typeof k.value === 'string');
    }

    slice(keys: string[]): MetaDataType[] {
        if (!this.data)
            return [];

        if (this.extraKey)
            return this.sliceWithExtraKey(keys);
        else
            return this.sliceWithoutExtraKey(keys);
    }

    sliceWithExtraKey(keys: string[]): MetaDataType[] {
        const data = [];

        keys.forEach((k) => {
            if (this.data[k] && this.data[k][this.extraKey])
                data.push({class: k, value: this.data[k][this.extraKey]});
        });

        return data;
    }

    sliceWithoutExtraKey(keys: string[]): MetaDataType[] {
        const data = [];

        keys.forEach((k) => {
            if (this.data[k])
                data.push({class: k, value: this.data[k]});
        });

        return data;
    }
}
