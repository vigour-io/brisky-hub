'use strict'
var uuid = require('vigour-js/lib/util/uuid')
uuid.val = 'REAL_' + uuid.val
var Hub = require('../../lib')
var hub = global.hub = new Hub({
  trackInstances: true,
  text: 1,
  adapter: {
    inject: require('../../lib/adapter/websocket')
  }
})
require('../basic/dev').startRepl()
hub.adapter.listens.val = 3033
