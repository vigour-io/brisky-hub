var Hub = require('../../lib/')
var colors = require('colors')

module.exports = new Hub({
  key: 'myHubA',
  adapter: {
    inject: require('../../lib/adapter/websocket')
  },
  clients: {
    on: {
      property (data) {
        console.log( '\nclients property listener' )
        if (data) {
          if (data.added) {
            console.log('  added:'.green, data.added )
          }
          if (data.removed) {
            console.log('  removed:'.red, data.removed )
          }
        }
        console.log('  clients:', this.map((property, key) => key))
      }
    }
  }
})
