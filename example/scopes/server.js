process.stdout.write('\033c') //eslint-disableore-line
console.log('start scope!')
'use strict'

const repl = require('repl')

var Hub = require('../../lib')
var fs = require('fs')
// var colors = require('colors-browserify')
// var http = require('http')
// var JSONStream = require('JSONStream')
var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    // id: 'mtv',
    websocket: {}
  },
  // scopes () {
  //   console.log('lulzzzz scope!', arguments)
  // },
  textfield: 'from non-scoped server'
})

hub.adapter.websocket.set({
  server: 3031
})

repl.start('> ').context.hub = hub


hub.define({
  tf: {
    get () {
      var tf = this.textfield
      return this.textfield._on.data.attach
    }
  },
  t () {
    var tf = this.textfield

    if (tf) {
      var b = tf._on

      if(b) {
        var c = b.data && b.data.attach
      }
      for (var i in b.data.attach) {
        if (i !== 'key' && b.data.attach[i] instanceof Array) {
          var client = b.data.attach[i][1]

          console.log(i, client.val, client.lookUp('_scope'), this._scope)
          // client
          // return client
        }
      }
    }
  },
  g () {
    console.log(this._scopes.anon.textfield instanceof this.textfield.Constructor)
  }
})