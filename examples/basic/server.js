'use strict'
var Hub = require('../../lib/')
var colors = require('colors')
var uuid = require('vigour-js/lib/util/uuid').val
var dev = require('./dev')

module.exports = global.hub = new Hub({
  adapter: {
    inject: dev.protocol,
    on: {
      connection () {
        global.currentStatus.up = this.val
        console.log('\n',
        uuid.green.bold,
        'connected',
        '\n    url:', this.val
        )
      },
      error (err) {
        console.log(err)
      },
      close () {
        console.log('o noes!'.red)
      },
      listens (data) {
        global.currentStatus.down = this.listens.val
        console.log(
          '\n',
          uuid.green.bold,
          'listening',
          '\n    protocol:', data,
          '\n    port:', this.listens.val
        )
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
      log: dev.data
    }
  }
})
