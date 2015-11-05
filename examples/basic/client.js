'use strict'
var uuid = require('vigour-js/lib/util/uuid').val
var Hub = require('../../lib/')
var dev = require('./dev')

var hub = new Hub({
  key: 'hub_client',
  adapter: {
    inject: dev.protocol,
    on: {
      connection (data) {
        console.log(uuid, 'connected to:', this.val)
      },
      error (err) {
        console.error(this.path.join('.') + ' error ', err)
      }
    }
  },
  clients: {
    on: {
      property: dev.clients
    }
  },
  on: {
    data: {
      performance: dev.performance,
      dev: dev.data
    }
  }
})

global.hub = module.exports = hub
