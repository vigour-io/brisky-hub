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
// hub.set({clients:{}})
hub.adapter.listens.val = 3031

var scopes = Hub.prototype.scopes
hub.define({
  scopes (scope, event) {
    var instance = scopes.call(this, scope, event)
    if (scope === 'meta') {
      instance.adapter.val = 3032
      console.log('ok ok????????', instance.hasOwnProperty('adapter'))
    }
    return instance
  }
})

// console.clear()


//.catch(console.log)

// setTimeout(() => {
//   console.log('no!')
//   hub.set({ text: 'from index' })
// }, 3500)
