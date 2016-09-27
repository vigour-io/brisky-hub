'use strict'
// const merge = require('lodash.merge') // use a simple merge, start some perf benchmarks

function merge (a, b) {
  for (let key in b) {
    let ak = a[key]
    let bk = b[key]
    if (ak && typeof ak === 'object') {
      merge(ak, bk)
    } else {
      a[key] = bk
    }
  }
}

module.exports = function serialize (data, state, type, stamp, subs) {
  const obj = {}
  const path = state.realPath(false, true)
  const len = path.length
  var select = obj
  for (let i = 0; i < len; i++) {
    // can alrdy start merging
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
      // deep super dangerous
      state.each((field, key) => {
        // can alrdy start merging
        select[key] = serialize(data, field, type, stamp, subs)
      })
    }
    select.stamp = state.stamp
  }
  merge(data, obj)
}
