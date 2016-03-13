'use strict'
var e = require('vigour-element/e')
var isNode = require('vigour-util/is/node')
var Hub = require('../../')
var hub = new Hub({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: {
      val: 'ws://localhost:3333',
      connected: {
        on: {
          data () {
            console.log('connected', this.val)
          }
        }
      }
    }
  }
})

var app = e({
  DOM: isNode ? {} : document.body,
  components: {
    input: {
      type: 'input',
      value: {},
      on: {
        keyup (e) {
          this.value.origin.val = e.currentTarget.value
        }
      }
    }
  },
  connected: {
    text: hub.adapter.connected
  },
  scope: {
    type: 'input',
    value: hub.adapter.scope
  },
  randomvalue: {
    type: 'input',
    value: hub.get('randomvalue', 'randomvalue')
  }
})

app.scope.value.origin.val = 'jim'

if (require('vigour-util/is/node')) {
  setTimeout(function () {
    app.scope.value.origin.val = 'jimA'
    // console.log(app.scope.value.val)
  }, Math.random() * 2000)
}

console.log(app.scope.value)
