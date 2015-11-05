'use strict'
var uuid = require('vjs/lib/util/uuid')
uuid.val = 'NODE_SCOPE_INSTANCE_' + uuid.val
var Hub = require('../../lib')
var hub = new Hub({
  adapter: {
    inject: require('../../lib/adapter/websocket')
  }
})

hub.adapter.val = {
  scope: 'meta',
  val: 3031
}

setInterval(() => {
  hub.set({ text: uuid.val + Math.random() * 999 })
}, 1000 / 24)
