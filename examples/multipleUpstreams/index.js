'use strict'
var uuid = require('vjs/lib/util/uuid')
uuid.val = 'server_' + uuid.val
var Hub = require('../../lib')
var hub = global.hub = new Hub({
  trackInstances: true,
  adapter: {
    inject: require('../../lib/adapter/websocket')
  }
})
require('../basic/dev').startRepl()
hub.adapter.listens.val = 3031
setTimeout(() => {
  console.log('no!')
  hub.set({ text: 'from index' })
}, 3500)
