'use strict'
var Hub = require('../../lib/')
var colors = require('colors')
var lines = process.stdout.getWindowSize()[1]
for (var i = 0; i < lines; i++) {
  console.log('\r\n')
}
var uuid = require('vjs/lib/util/uuid').val

module.exports = new Hub({
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection () {
        console.log('\n',
        uuid.green.bold,
        'connected',
        '\n    url:', this.val
        )
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
      property: require('./log').clients
    }
  }
})
