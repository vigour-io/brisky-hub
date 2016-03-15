'use strict'
var e = require('vigour-element/e')
var isNode = require('vigour-util/is/node')
var Hub = require('../../')
// state will get hubs as injectables or other way arround?
var hub = new Hub({
  adapter: {
    websocket: {
      val: 'ws://localhost:3334',
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
  }, Math.random() * 2000)
}

console.log(app.scope.value)
