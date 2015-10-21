'use strict'
require('./style.less')
var Element = require('element')
Element.prototype.inject(
  require('element/lib/property/text'),
  require('element/lib/property/transform'),
  require('element/lib/events/drag')
)
var Observable = require('vjs/lib/observable')
var msgCount = new Observable(0)
var Hub = require('../../lib')
var ui = require('../ui')
var start = Date.now()
var now = new Observable(0)
setInterval(() => now.val++, 1e3)

var hub = global.hub = new Hub({
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection () {
        console.log('context!')
      }
    }
  },
  on: {
    data (data) {
      msgCount.val++
    }
  }
})

// ofcourse we need reconnection strategies here!
setTimeout(() => hub.adapter.val = 3031, 200)
setTimeout(() => hub.set({bla: 'something!'}), 300)

global.app = new Element({
  node: document.body,
  css: 'app',
  holder: {
    labels: {
      ChildConstructor: ui.Label,
      uuid: { text: require('vjs/lib/util/uuid').val },
      start: {
        text: {
          val: start,
          inject: require('../ui/transform/time')
        }
      },
      now: {
        text: {
          val: now,
          inject: require('../ui/transform/time')
        }
      }
    },
    // dit wil je eigenlijk gewoon supporten!
    msg: new ui.Stat({
      title: { text: 'Msg/s' },
      counter: {
        text: {
          inject: require('vjs/lib/operator/transform'),
          val: msgCount,
          $transform: (val) => ~~((val / ((Date.now() - start))) / 100) / 10
        }
      }
    }),
    clients: new ui.Stat({
      title: { text: 'Clients' },
      counter: {
        text: {
          inject: require('vjs/lib/operator/transform'),
          val: hub.get('clients', {}),
          $transform (val) {
            var cnt = 0
            val.each(() => cnt++)
            return cnt
          }
        }
      }
    }),
    button: new ui.Button({ text: 'Reconnect' })
  }
})

//  input: new ui.Input({ text: hub.get('text', {}) }),
