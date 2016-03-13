'use strict'
var e = require('vigour-element/e')
var isNode = require('vigour-util/is/node')
var Hub = require('../../')
var app
var hub = new Hub({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: {
      val: 'ws://localhost:3333',
      connected: {
        on: {
          data () {
            console.log(this, app.indicator.text.val)
          }
        }
      }
    }
  }
})

app = e({
  DOM: isNode ? {} : document.body,
  indicator: {
    text: hub.adapter.websocket.connected
  }
})

console.log('lets go!')
