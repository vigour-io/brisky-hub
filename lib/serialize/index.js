'use strict'
const merge = require('lodash.merge')

module.exports = function serialize (data, state, type, stamp, subs, tree, sType, id) {
  const obj = {}
  const path = state.realPath(false, true)
  const len = path.length
  var select = obj

  // console.log(subs)

  for (let i = 0; i < len; i++) {
    select = select[path[i]] = {}
  }

  console.log(state.path())

  if (state.val === null) {
    select.val = null
    select.stamp = state.stamp
  } else {
    if (state.val && state.val.isBase) {
      select.val = '$root.' + state.val.realPath(false, true).join('.')
      serialize(data, state.val, type, stamp, subs, tree, sType, id)
    } else if (state.val !== void 0) { select.val = state.val }
    select.stamp = state.stamp
  }
  // console.log(' \n', id)
  // console.log(JSON.stringify(obj, false, 2))
  // console.log(' \n')
  merge(data, obj)
}
