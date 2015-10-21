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
var connected = new Observable(false)
var uuid = require('vjs/lib/util/uuid').val
setInterval(() => {
  now.val++
}, 1000)

var hub = global.hub = new Hub({
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection () {
        connected.val = true
        console.log('CONNECTION')
      },
      close () {
        connected.val = false
        console.log('close')
      },
      error (err) {
        console.error('err!', err)
      }
    }
  },
  text: {
    on: {
      data (data) {
        msgCount.val++
      }
    }
  }
})

// ofcourse we need reconnection strategies here!
setTimeout(() => hub.adapter.val = 3031, 200)
setTimeout(() => hub.set({bla: 'something!'}), 300)

var app = global.app = new Element({
  node: document.body,
  css: 'app',
  holder: {
    labels: {
      ChildConstructor: ui.Label,
      uuid: { text: uuid },
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
      },
      upstream: { text: hub.adapter }
    },
    // dit wil je eigenlijk gewoon supporten!
    msgcnt: new ui.Stat({
      title: { text: 'Messages' },
      counter: {
        text: {
          inject: require('../ui/transform/number'),
          val: msgCount
        }
      }
    }),
    msg: new ui.Stat({
      title: { text: 'Msg/s' },
      counter: {
        text: {
          inject: require('vjs/lib/operator/transform'),
          val: msgCount,
          $transform: (val) => ~~((val / ((Date.now() - start)))*1000)
        }
      }
    }),
    clients: new ui.Stat({
      status: {
        inject: require('vjs/lib/operator/transform'),
        $transform: (val) => val ? 'ok' : 'error',
        val: connected
      },
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
    })
  }
})

var updating = new Observable(false)
updating.on(function (data) {
  clearInterval(this._interval)
  this._interval = null
  if (this.val === true) {
    this._interval = setInterval(() => {
      hub.set({ text: (~~(Math.random() * 100)) + uuid })
    }, 0)
  }
})

app.holder.set({
  input: new ui.Input({ input: { text: hub.get('text', {}) } }),
  // input2: new ui.Input({ input: { text: hub.get('text', {}) } }),
  button: new ui.Button({
    text: {
      inject: require('vjs/lib/operator/transform'),
      val: updating,
      $transform: (val) => val === true ? 'Stop updates' : 'Fire updates'
    },
    css: {
      inject: require('vjs/lib/operator/transform'),
      val: updating,
      $transform: (val) => val === true ? 'ui-button active' : 'ui-button inactive'
    },
    on: {
      click () {
        updating.val = !updating.val
      }
    }
  })
})
