'use strict'
var Observable = require('vigour-js/lib/observable')
var ua = require('vigour-ua')
var isNode = require('vigour-js/lib/util/is/node')
module.exports = new Observable({
  useVal: true,
  properties: {
    Connection: true,
    connections: true
  },
  on: {
    value: {
      upstream (data, event) {
        if (!this.hasOwnProperty('client')) {
          let hub = this.parent.parent
          let id = this.lookUp('id')
          let set = { val: id }
          if (isNode) {
            set.platform = 'node'
          } else {
            ua(window.navigator.userAgent, set)
          }
          hub.set({ clients: { [id]: set } }, event)
          let client = hub.clients[id]
          this.set({ client: client }, event)
          // ugh want to pass event but something is missing (.binds) make more tests in vjs!!!
          client.set({
            connection: new this.Connection({ upstream: this }, event)
          })
        } else {
          console.log('allready have client its only a switch! -- connection should listen!')
        }
        this.emit('connect', data, event)
      }
    }
  }
}).Constructor
