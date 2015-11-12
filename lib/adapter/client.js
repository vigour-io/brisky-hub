'use strict'
var ua = require('vigour-ua')
var isNode = require('vigour-js/lib/util/is/node')

exports.properties = {
  client: require('../client')
}

// has to become a reference!

exports.define = {
  getClient (event) {
    // this has to become a lot smarter!
    if (!this.client || !this.hasOwnProperty('client')) {
      let hub = this.parent
      let id = this.id
      let set = { val: id }
      if (!isNode) {
        ua(window.navigator.userAgent, set)
      } else {
        set.platform = 'node' // version?
      }
      hub.set({ clients: { [id]: set } }, event)
      this.set({ client: hub.clients[id] }, event)
    }
    return this.client
  }
}
