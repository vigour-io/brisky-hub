var Hub = require('../../lib/')
// var b = new Hub({})

var a = new Hub({
  key: 'myHubA',
  adapter: {
    inject: require('../../lib/adapter/protocol/mock')
  }
})
