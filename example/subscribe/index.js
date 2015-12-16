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


var obs = new Observable({
  key: 'obsbitch'
})

obs.val = client
//
// obs.subscribe({
//   mybitch: true
// }, function () {
//   console.log('my subs bitch'.rainbow)
// })


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
        if (obs._input === client) {
          this.text.val = 'ok lets subscribe'
        } else {
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
    text: 'xxxx',
    x: client.get('boeloe.mybitch.x', {}),
    y: client.get('boeloe.mybitch.y', {}),
    on: {
      drag (evt) {
        console.log('beurs')
        this.parent.origin.mybitch.set({
          x: evt.x,
          y: evt.y
        })
      },
      keyup () {
        console.log('this.text.origin',this.text.origin)
        this.text.origin.val = this.node.value
      }
    }
  },
  val: client.get('boeloe', {})
})

app.textfield.subscribe({
  $upward: {
    mybitch: {
      x: true,
      y: true
    }
  }
})
