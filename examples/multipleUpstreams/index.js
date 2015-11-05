'use strict'
var uuid = require('vigour-js/lib/util/uuid')
uuid.val = 'server_' + uuid.val
var Hub = require('../../lib')
Hub.prototype.inject(require('../dev'))
console.clear()
var hub = global.hub = new Hub({
  key: 'origin',
  adapter: {
    inject: require('../../lib/adapter/websocket')
  }
})

hub.adapter.listens.val = 3031
hub.adapter.val = 3033
// console.log('set normal adapter!')
var _scopes = Hub.prototype.scopes
hub.define({
  scopes (scope, event) {
    var instance = _scopes.call(this, scope, event)
    if (scope === 'meta') {
      instance.key = 'meta'
      // check is not nessecary pure for loggin (same is auto-blocked)
      // console.log('set meta-instance adapter to 3032'.green.bold)
      instance.adapter.val = 3032
    }
    return instance
  }
})

require('../basic/dev').startRepl()
