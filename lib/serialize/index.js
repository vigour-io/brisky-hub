'use strict'
const merge = require('lodash.merge') // use a simple merge, start some perf benchmarks

module.exports = function serialize (data, state, type, stamp, subs) {

  console.log('serlize')

  const obj = {}
  const path = state.realPath(false, true)
  const len = path.length
  var select = obj
  for (let i = 0; i < len; i++) {
    select = select[path[i]] = {}
  }
  if (state.val === null) {
    select.val = null
    select.stamp = state.stamp
  } else {
    if (state.val && state.val.isBase) {
      select.val = '$root.' + state.val.realPath(false, true).join('.')
      serialize(data, state.val, type, stamp, subs)
    } else if (state.val !== void 0) {
      select.val = state.val
    }
    if (subs && subs.val === true) {
      state.each((field, key) => {
        select[key] = serialize(data, field, type, stamp, subs)
      })
    }
    select.stamp = state.stamp
  }
  merge(data, obj)
}
