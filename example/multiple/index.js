'use strict'
var uuid = require('vigour-js/lib/util/uuid')
uuid.val = 'server_' + uuid.val
var Hub = require('../../lib')
Hub.prototype.inject(require('../../dev'))
var hub = global.hub = new Hub({
  key: 'origin',
  adapter: {
    // inject: require('../../lib/adapter/websocket')
    // val: 3033
    // listens: 3031 // this has to be fixed listenes in inject need to fire
  },
  clients: {
    on: {
      property (data, event) {
        // whats weird is that we still recieve clients from other hubs -- bit confusing
        console.log('set on client'.rainbow, data, this.path)
      }
    }
  }
})

hub.adapter.set({
  val: 3033,
  listens: 3031 // this has to be fixed listenes in inject need to fire
})

// console.log('set normal adapter!')
var _scopes = Hub.prototype.scopes
// give this a suitable method name
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

// require('../basic/dev').startRepl()
