'use strict'
var e = require('vigour-element/e')
var isNode = require('vigour-util/is/node')
var Hub = require('../../')
// state will get hubs as injectables or other way arround?

var hub = new Hub({
  // $: '*deep', // support something like this syncs all
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
        keyup (e, ev) {
          this.value.origin.set(e.currentTarget.value, ev)
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

app.scope.value.origin.set('jim')

if (require('vigour-util/is/node')) {
  setTimeout(function () {
    app.scope.value.origin.set('jimA')
    hub.set({ field: Math.random() * 200 })
  }, Math.random() * 2000)
}

console.log(app.scope.value)
