class MetaData {
  constructor(data) {
    this.data = data
  }

  slice(keys) {
    if(!this.data)
      return

    let data = []

    keys.forEach((k)=> {
      if(this.data[k])
        data.push({class: k, value: this.data[k]})
    })

    return data
  }
}

module.exports = MetaData
