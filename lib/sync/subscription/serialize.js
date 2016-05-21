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
  return subs
}
