'use strict'
var Hub = require('../../lib/')
var colors = require('colors')
var uuid = require('vjs/lib/util/uuid').val

module.exports = new Hub({
  adapter: {
    inject: require('../../lib/adapter/tcp'),
    on: {
      connection () {
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
      property: require('./dev').clients
    }
  },
  on: {
    data: {
      performance: require('./dev').performance,
      log: require('./dev').data
    }
  }
})
