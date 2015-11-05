'use strict'
var uuid = require('vigour-js/lib/util/uuid')
uuid.val = 'meta_' + uuid.val
var Hub = require('../../lib')
var hub = global.hub = new Hub({
  trackInstances: true,
  text: 1,
  adapter: {
    inject: require('../../lib/adapter/websocket')
  }
})
hub.adapter.listens.val = 3032
Hub.prototype.inject(require('../dev'))

require('../basic/dev').startRepl()
