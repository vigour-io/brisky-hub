'use strict'
var uuid = require('vjs/lib/util/uuid')
uuid.val = 'server_' + uuid.val
var Hub = require('../../lib')
var hub = global.hub = new Hub({
  adapter: {
    inject: require('../../lib/adapter/websocket')
  },
  blurf: true
})

require('../basic/dev').startRepl()
hub.adapter.listens.val = 3031
var _scopes = Hub.prototype.scopes

hub.define({
  scopes (scope, event) {
    var instance = _scopes.call(this, scope, event)
    if (scope === 'meta') {
      // console.log('  1----do it!----', instance.scope, instance !== hub)
      instance.blurf.val = 'haha'
      instance.adapter.val = 3032
      // console.log('  2----do it!----', instance.scope, instance.hasOwnProperty('_adapter'),  instance.hasOwnProperty('blurf'))
    }
    return instance
  }
})
