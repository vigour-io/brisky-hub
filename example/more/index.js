'use strict'
require('./style.less')
var Hub = require('../../lib')
var hub = global.hub = new Hub()

hub.set({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3031'
  }
})

var Element = require('vigour-element')
var Prop = require('vigour-element/lib/property')
var app = require('vigour-element/lib/app')

var A = new Element({
  $: true,
  text: { $: 'title' },
  button: {
    type: 'button',
    text: 'yo button',
    on: {
      click () {
        if (hub.blurf.origin === hub.blarf) {
          hub.blurf.val = false //.remove()
        } else {
          hub.set({'blarf': {
            title: 'its a blurf!'
          }})
          hub.blurf.val = hub.blarf
        }
      }
    }
  }
}).Constructor

app.set({
  c: {
    $: true,
    text: 'list',
    blurf: {
      type: 'ul',
      $collection: true,
      ChildConstructor: new Element({
        type: 'li',
        text: { $: 'title' }
      })
    },
    val: hub
  },
  b: new A(hub.get('blurf', {}))
})

