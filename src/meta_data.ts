export type MetaDataType = { class: string, value: any }  // eslint-disable-line @typescript-eslint/no-explicit-any

export class MetaData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(private data: Record<string, any>, private extra_key?: string) {
    }

    get(keys: string[]): MetaDataType[] {
        return this.slice(keys).filter((k) => typeof k.value === 'string');
    }

    slice(keys: string[]): MetaDataType[] {
        if (!this.data)
            return [];

        if (this.extra_key)
            return this.slice_with_extra_key(keys);
        else
            return this.slice_without_extra_key(keys);
    }

    slice_with_extra_key(keys: string[]): MetaDataType[] {
        const data = [];

        keys.forEach((k) => {
            if (this.data[k] && this.data[k][this.extra_key])
                data.push({class: k, value: this.data[k][this.extra_key]});
        });

        return data;
    }

    slice_without_extra_key(keys: string[]): MetaDataType[] {
        const data = [];

        keys.forEach((k) => {
            if (this.data[k])
                data.push({class: k, value: this.data[k]});
        });

        return data;
    }
}
