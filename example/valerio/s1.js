var log = require('../dev/utils').log
var Hub = require('../../lib')

var s1 = global.s1 = new Hub({
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection () {
        log.info('-- S1 Connection')
      }
    }
  },
  clients: {
    on: {
      property (data, ev) {
        log.info('-- S1 Property', [ev.stamp, ev.type, JSON.stringify(data)].join(' - '))
      }
    }
  }
})

s1.adapter.listens.val = 3031
