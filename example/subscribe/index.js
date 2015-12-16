'use strict'
var Observable = require('vigour-js/lib/observable')
var colors = require('colors-browserify') //eslint-disable-line
var Hub = require('../../lib')
require('./style.less')
console.line = false

var client = global.client = new Hub({
  key: 'client',
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3031'
  }
})

var App = require('vigour-element/lib/app')

var Element = require('vigour-element').prototype.inject(
  require('vigour-element/lib/property/text'),
  require('vigour-element/lib/property/css'),
  require('vigour-element/lib/events'),
  require('vigour-element/lib/property/transform'),
  require('vigour-element/lib/events/drag')
)

var app = new App({
  key: 'app',
  node: document.body,
  btn: {
    node: 'button',
    text: 'ok lets unsubscribe',
    on: {
      click () {
        console.clear()
        if (app._input !== client) {
          app.val = client
          this.text.val = 'ok lets subscribe'
        } else {
          app.val = false
          this.text.val = 'ok lets unsubscribe'
        }
        // obs.val = obs._input === client ? 'haha' : client
      }
    }
  },
  removebtn: {
    node: 'button',
    text: 'REMOVE',
    on: {
      click () {
        console.clear()
        if (this.parent.textfield) {
          this.parent.textfield.remove()
        } else {
          this.parent.set({textfield:{ text: { $: 'mybitch' }}})
        }
      }
    }
  },
  textfield: {
    css: 'thing',
    node: 'input',
    text: {
      inject: require('vigour-js/lib/operator/subscribe'),
      $: 'mybitch'
      // val:client.get('mybitch',{})
    },
    on: {
      keyup () {
        this.text.origin.val = this.node.value
      }
    }
  },
  val: client
})

// app.textfield.subscribe({
//   $upward: {
//     mybitch: true
//   }
// })
