'use strict'

function merge (a, b) {
  for (let i in b) {
    if (!a[i] || typeof a[i] !== 'object') {
      a[i] = b[i]
    } else {
      merge(a[i], b[i])
    }
  }
}

module.exports = function serializeSubscription (state, subs) {
  console.log('IN:', JSON.stringify(subs, false, 2))
  const parsed = parse(subs, false, false, state)
  console.log('parsed:', JSON.stringify(parsed, false, 2))
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
        result[i] = parse(obj[i], i, root, state)
      }
    }
  }
  return result
}
