var Element = require('vigour-element')
var Hub = require('../../lib')
var log = require('../dev/utils').log

var c2 = new Hub({
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection () {
        log.info('-- C2 Connected ')
      },
      error (err, ev) {
        log.error('-- C2 Error ', err.message)
      }
    }
  },
  clients: {
    on: {
      property (data, ev) {
        log.info('-- C2 Property ', data)
      }
    }
  },
  on: {
    data () {
      log.info('-- C2 Data ')
    }
  }
})

setTimeout(() => {c2.adapter.val = 3032}, 2000)
