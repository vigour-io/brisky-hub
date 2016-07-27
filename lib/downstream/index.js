'use strict'
const server = require('./server')
const closeServer = require('./server/close')

exports.properties = {
  downstream: true,
  port: {
    type: 'observable',
    noContext: true,
    on: {
      data () {
        const hub = this.cParent()
        const val = this.compute()
        if (hub.downstream) {
          closeServer(hub.downstream)
          hub.downstream = null
        }
        if (val) {
          server(hub, val)
        }
      }
    }
  }
}

exports.on = {
  remove: {
    port () {
      // multiple servers for different contexts... be carefull but could be possible
      if (this.hasOwnProperty('port')) {
        this.port.set(null)
      }
    }
  }
}
