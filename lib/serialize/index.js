'use strict'
const merge = require('lodash.merge') // use a simple merge
// general purpose for upstream as well -- really is the best

module.exports = function serialize (data, state, type, stamp, subs, tree, sType, id) {
  // console.log(state.root.context, state.path())
  // console.log(state.root.get(state.path()) === state)
  // this is sort of it.. we need to go walk the path back
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
      // console.log('got a ref right hur', state.path(), state.val.path(), state.stamp)
      select.val = '$root.' + state.val.realPath(false, true).join('.')
      serialize(data, state.val, type, stamp, subs, tree, sType, id)
    } else if (state.val !== void 0) { select.val = state.val }
    select.stamp = state.stamp
  }
  merge(data, obj)
}
