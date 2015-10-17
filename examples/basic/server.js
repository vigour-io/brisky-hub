'use strict'
var Hub = require('../../lib/')
var colors = require('colors')
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
  },
  on: {
    data: function (data, event) {
      console.log('      update on datax!', event.stamp, data)
      // console.log(JSON.stringify(this.serialize(),false,2))
    }
  }
})
