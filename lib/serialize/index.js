'use strict'

module.exports = function serialize (data, state, type, stamp, subs, client) {
  const isUpstream = client.upstream
  if (
    isUpstream ||
    (state.syncDown && (!state.syncDownIsFn || state.syncDown(state)))
  ) {
    const path = state.realPath(false, true)
    const len = path.length
    var s = data
    for (let i = 0; i < len; i++) {
      let t = s[path[i]]
      if (!t) {
        s = s[path[i]] = {}
      } else {
        s = t
      }
    }
    s.stamp = state.stamp
    if (state.val === null) {
      s.val = null
    } else {
      if (state.val && state.val.isBase) {
        s.val = '$root.' + state.val.realPath(false, true).join('.')
        serialize(data, state.val, type, stamp)
      } else if (state.val !== void 0) {
        s.val = state.val
      }
      if (subs && subs.val === true) {
        state.each((field, key) => {
          serialize(data, field, type, stamp, subs)
        })
      }
    }
  }
}
