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

setTimeout(() => {
  hub.adapter.val = 3033
}, 500)
//
// setInterval(() => {
//   hub.set({text: 'haha'})
// }, 3000)

// hub.set({
//   text: null
// })
