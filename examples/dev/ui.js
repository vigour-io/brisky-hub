'use strict'
require('./style.less')

var Element = require('element')
Element.prototype.inject(
  require('element/lib/property/text'),
  require('element/lib/property/transform'),
  require('element/lib/events/drag')
)
var Observable = require('vjs/lib/observable')
var Hub = require('../../lib')
var uikit = require('uikit')
var uuid = require('vjs/lib/util/uuid').val

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

var start = Date.now()
var now = new Observable(0)
var connected = new Observable(false)
var msgCount = new Observable({
  val: 0,
  lastSecond: 0
})

setInterval(() => {
  now.val++
  msgCount.lastSecond.val = msgCount.val
}, 1000)

var app = global.app = new Element({
  node: document.body,
  rendered: true,
  css: 'app',
  holder: {
    labels: {
      ChildConstructor: uikit.Badge,
      uuid: {
        label: { text: 'uuid' },
        message: { text: uuid }
      },
      now: {
        label: { text: 'time' },
        message: {
          text: {
            val: now,
            inject: require('uikit/lib/transform/time')
          }
        }
      },
      upstream: new uikit.InputBadge({
        label: { text: 'upstream' },
        message: { text: hub.adapter }
      }),
      instance: new uikit.InputBadge({
        label: { text: 'instance' },
        message: { text: hub.adapter.instance }
      }),
      clock: new uikit.Label({
        text: {
          val: start,
          inject: require('uikit/lib/transform/time')
        }
      })
    },
    msgcnt: new uikit.Stat({
      title: { text: 'Messages' },
      counter: {
        text: {
          inject: require('uikit/lib/transform/number'),
          val: msgCount
        }
      }
    }),
    msg: new uikit.Stat({
      title: { text: 'Msg/s' },
      counter: {
        text: {
          inject: require('vjs/lib/operator/transform'),
          val: now,
          $transform: (val) => ~~(msgCount.val - msgCount.lastSecond.val)
        }
      }
    }),
    clients: new uikit.Stat({
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
      hub.set({ text: (~~(Math.random() * 1000)) + ' from:' + uuid })
    }, 0)
  }
})

app.holder.set({
  input: new uikit.Input({
    input: { text: hub.get('text', {}) }
  }),
  input2: new uikit.Input({
    input: { text: hub.get('text2', {}) }
  }),
  button: new uikit.Button({
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

exports.app = app
exports.hub = hub
