class MetaData {
  constructor(data, extra_key) {
    this.data = data;
    this.extra_key = extra_key;
  }

  slice(keys) {
    if (!this.data)
      return [];

    if (this.extra_key)
      return this.slice_with_extra_key(keys);
    else
      return this.slice_without_extra_key(keys);
  }

  slice_with_extra_key(keys) {
    const data = [];

    keys.forEach((k) => {
      if (this.data[k] && this.data[k][this.extra_key])
        data.push({class: k, value: this.data[k][this.extra_key]});
    });

    return data;
  }

  slice_without_extra_key(keys) {
    const data = [];

    keys.forEach((k) => {
      if (this.data[k])
        data.push({class: k, value: this.data[k]});
    });

    return data;
  }
}

module.exports = MetaData;
