var Hub = require('../../lib/')
var colors = require('colors')
var lines = process.stdout.getWindowSize()[1]
for (var i = 0; i < lines; i++) {
  console.log('\r\n')
}

module.exports = new Hub({
  key: 'origin',
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
        if (this.parent.adapter.client) {
          console.log('    client:', this.parent.adapter.client.val)
        }
        console.log('    clients:', this.map((property, key) => key))
      }
    }
  }
})
