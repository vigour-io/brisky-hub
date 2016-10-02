'use strict'
const isEmpty = require('vigour-util/is/empty')

function merge (a, b) {
  for (let i in b) {
    if ((!a[i] || typeof a[i] !== 'object') && i !== '_') {
      a[i] = b[i]
    } else {
      merge(a[i], b[i])
    }
  }
}

module.exports = function serializeSubscription (state, subs) {
  const parsed = parse(subs, false, false, state)
  return parsed
}

function parse (obj, key, root, state) {
  const result = {}
  if (!root) { root = result }
  for (let i in obj) {
    if (i !== '_') {
      // @todo more resolve for parent
      if (i === 'client' && (!key || key === '$root' || key === '$parent')) {
        let id = state.root.id
        if (!root.clients) { root.clients = {} }
        if (!root.clients[id]) { root.clients[id] = {} }
        merge(root.clients[id], obj.client)
        delete obj.client
        if (isEmpty(obj)) {
          return void 0
        }
      } else if (i === 'exec' && typeof obj[i] === 'function') {
        let val = obj[i].toString()
        if (!/^(function|\()/.test(val)) { val = 'function ' + val }
        result['$fn|' + i] = val
      } else if (i === 'val') {
        if (obj._ && obj._.sync) {
          if (obj._.sync !== true) { result[i] = obj._.sync }
        } else {
          result[i] = obj[i]
        }
      } else {
        // empty objects are very uninresetting maybe just skip them
        let parsed = parse(obj[i], i, root, state)
        if (parsed !== void 0) { result[i] = parsed }
      }
    }
  }
  return result
}
