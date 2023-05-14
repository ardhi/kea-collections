const _ = require('lodash')

class KeaCollections {
  constructor ({ pk, columns = [], ts = 'ts' }) {
    this.data = []
    this.pk = pk
    this.columns = columns
    this.ts = ts
  }

  upsert (data) {
    let rec = _.cloneDeep(data)
    if (this.ts) rec[this.ts] = (new Date()).toISOString()
    if (this.columns.length > 0) rec = _.pick(rec, this.columns)
    if (_.isEmpty(rec)) return
    const idx = _.findIndex(this.data, _.set({}, this.pk, rec[this.pk]))
    if (idx === -1) {
      this.data.push(rec)
      return rec
    }
    this.data[idx] = _.merge({}, this.data[idx], rec)
    return this.data[idx]
  }

  remove (ids = []) {
    if (!_.isArray(ids)) ids = [ids]
    let idxs = _.map(ids, id => _.findIndex(this.data, _.set({}, this.pk, id)))
    idxs = _.without(idxs, null, undefined)
    if (idxs.length > -1) _.pullAt(this.data, idxs)
  }
}

module.exports = KeaCollections
