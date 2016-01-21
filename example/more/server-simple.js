process.stdout.write('\033c') //eslint-disableore-line
console.log('start!')
'use strict'
var Hub = require('../../lib')
var fs = require('fs')
var http = require('http')

// need to put login here
// require('mtv play?')

var JSONStream = require('JSONStream')
var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    id: 'mtv',
    websocket: {}
  },
  autoRemoveScopes: false,
  scope (scope, event, getScope) {
    //this, scope, event, getScope
    var init
    if (!this._scopes || !this._scopes[scope]) {
      init = true
    }
    var ret = getScope.apply(this, arguments)
    if (init) {
      //lets do the auth here
      console.log('init!', scope)
      ret.set({
        user: {
          name: scope
        }
      }, false)
    }
    return ret
  }
})

hub.adapter.websocket.server.val = 60380
