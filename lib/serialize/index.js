'use strict'
const merge = require('lodash.merge')

module.exports = function (data, state, type, stamp, subs, tree, sType) {
  const obj = {}
  const path = state.realPath(false, true)
  const len = path.length
  var select = obj

  // console.log(subs)

  for (let i = 0; i < len; i++) {
    select = select[path[i]] = {}
  }

  if (state.val !== null) {
    if (state.val !== void 0) { select.val = state.val }
    select.stamp = state.stamp
  }

  // console.log(' \n')
  // console.log(JSON.stringify(obj, false, 2))
  // console.log(' \n')
  merge(data, obj)
}
