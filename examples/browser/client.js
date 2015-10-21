'use strict'
var Element = require('element')
Element.prototype.inject(
  require('element/lib/property/text'),
  require('element/lib/property/transform'),
  require('element/lib/events/drag')
)

var Hub = require('../../lib')

var hub = global.hub = new Hub({
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection () {
        console.log('conext!')
      }
    }
  }
})

// ofcourse we need reconnection strategies here!
setTimeout(() => hub.adapter.val = 3031, 200)

var a = new Element({
  node: document.body
})

a.set({
  bla: {
    node: 'textarea',
    x: {},
    y: {},
    text: hub.get('bla', {}),
    on: {
      keyup (data) {
        this.text.origin.val = this.node.value
      },
      drag (event) {
        console.log('?')
        this.x.origin.val = event.x - 100
        this.y.origin.val = event.y - 10
      }
    }
  }
})
