'use strict'
module.exports = function serializeSubscription (state, subs) {
  if ('client' in subs) {
    let hub = state.getRoot()
    if (hub === state) {
      console.log('special handle for client')
      subs.clients = { [hub.id]: subs.client }
      delete subs.client
    }
  }
  // functions
  // remove _ field
  return parse(subs)
}

function parse (obj) {
  const result = {}
  for (let i in obj) {
    if (i !== '_') {
      if (i === 'val' || i === 'done') {
        result[i] = obj[i]
      } else {
        result[i] = parse(obj[i])
      }
    }
  }
  return result
}
