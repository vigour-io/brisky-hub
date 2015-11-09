'use strict'
var uuid = require('vigour-js/lib/util/uuid').val
var ua = require('vigour-ua')
var isNode = require('vigour-js/lib/util/is/node')

exports.properties = {
  client: require('../client')
}

exports.define = {
  getClient (event, connection) {
    // this is still a bit dirty
    if (!this.client || !this.hasOwnProperty('client')) {
      let hub = this.parent
      let id = uuid
      let set = { val: id }
      if (!isNode) {
        ua(window.navigator.userAgent, set)
      } else {
        set.platform = 'node' // version?
      }
      this.set({ client: set }, event, true)
      hub.set({ clients: { [id]: this.client } }, event)
      this.client.connection = connection
      connection.client = this.client
    }
    return this.client
  }
}
