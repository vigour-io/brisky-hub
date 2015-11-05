'use strict'
var uuid = require('vigour-js/lib/util/uuid')
uuid.val = 'server_' + uuid.val
var Hub = require('../../lib')
var hub = global.hub = new Hub({
  key: 'hub',
  adapter: {
    inject: require('../../lib/adapter/websocket')
  },
  text: 'haha',
  blurf: true
})

require('../basic/dev').startRepl()
hub.adapter.listens.val = 3031
hub.adapter.val = 3033
var _scopes = Hub.prototype.scopes
hub.define({
  scopes (scope, event) {
    var instance = _scopes.call(this, scope, event)
    if (scope === 'meta') {
      instance.adapter.val = 3032
    }
    return instance
  }
})
