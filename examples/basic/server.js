'use strict'
var Hub = require('../../lib/')
var colors = require('colors')
var lines = process.stdout.getWindowSize()[1]
for (var i = 0; i < lines; i++) {
  console.log('\r\n')
}

module.exports = new Hub({
  key: 'singleserver',
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection () {
        console.log('\n',
        this.parent.path.join(' -> ').green.bold,
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
          this.parent.path.join(' -> ').green.bold,
          'listening',
          '\n    protocol:', data,
          '\n    port:', this.listens.val
        )
      }
    }
  },
  clients: {
    on: {
      property (data) {
        console.log(
          '\n',
          this.parent.path.join(' -> ').green.bold,
          'clients'
        )
        if (data) {
          if (data.added) {
            console.log('    added:'.green, data.added)
          }
          if (data.removed) {
            console.log('    removed:'.red, data.removed)
          }
        }
        var client = this.parent.adapter.client && this.parent.adapter.client.val
        if (client) {
          console.log('    client:', client)
        }
        var arr = this.map((property, key) => key)
        var str = '[ '
        for (let i in arr) {
          str += ((i == 0 ? '' : ', ') + (arr[i] === client ? arr[i].green.bold : arr[i]))
        }
        str += ' ]'
        console.log('    clients:', str )
      }
    }
  }
})
