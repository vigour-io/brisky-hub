var log = require('../dev/utils').log
var Hub = require('../../lib')

var s2 = new Hub({
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection () {
        log.info('-- S2 Connection')
      }
    }
  },
  clients: {
    on: {
      property (data, ev) {
        log.info('-- S2 Property', [ev.stamp, ev.type, JSON.stringify(data)].join(' - '))
      }
    }
  }
})

s2.adapter.listens.val = 3032
