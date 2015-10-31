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
        console.error('err!', err.stack)
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

var FireButton = new uikit.Button({
  properties: {
    updating: function(val) {
      this._updating = val
      this.set({
        text: val,
        css: val
      })
    }
  },
  text: {
    inject: require('vjs/lib/operator/transform'),
    $transform: (val) => val === true ? 'Stop updates' : 'Fire updates'
  },
  css: {
    inject: require('vjs/lib/operator/transform'),
    $transform: (val) => val === true ? 'ui-button active' : 'ui-button inactive'
  },
  on: {
    click () {
      this._updating.val = !this._updating.val
    }
  }
}).Constructor

var app = global.app = new Element({
  node: document.body,
  rendered: true,
  css: 'app',
  holder: {
    labels: {
      ChildConstructor: uikit.Badge,
      uuid: {
        message: { text: uuid }
      },
      time: {
        message: {
          text: {
            val: now,
            inject: require('uikit/lib/transform/time')
          }
        }
      },
      upstream: new uikit.InputBadge({
        message: { text: hub.adapter }
      }),
      instance: new uikit.InputBadge({
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

var fieldName = new Observable(1)

var addfields = new Observable(false)
addfields.on(function (data) {
  clearInterval(this._interval)
  this._interval = null
  if (this.val === true) {
    this._interval = setInterval(() => {
      hub.set({ [fieldName.val]: ~~(Math.random() * 999999) })
      fieldName.val++
    }, 0)
  }
})

app.holder.set({
  textfields: {
    ChildConstructor: uikit.Input,
    textField: {
      input: { text: hub.get('text', {}) }
    },
    textField2: {
      input: { text: hub.get('text2', {}) }
    }
  },
  button: new FireButton({ updating: updating }),
  addfield: {
    button: new uikit.Button({
      text: {
        val: 'add field: ',
        inject: require('vjs/lib/operator/add'),
        $add: fieldName
      },
      on: {
        click () {
          hub.set({ [fieldName.val]: ~~(Math.random() * 999999) })
          fieldName.val++
        }
      }
    })
  },
  addfields: new FireButton({ updating: addfields })
})

app.set({
  keysOverview: {
    css: 'labels',
    ChildConstructor: uikit.Badge
  }
})

// for(var i = 0 ; i < 2000; i++) {
//   hub.get(i+1+'', {})
// }

hub.on('property', function (data, event) {
  if (data.added) {
    for (let i in data.added) {
      app.keysOverview.setKey(data.added[i], { message: { text: this[data.added[i]]} }, event)
    }
  }
  if (data.removed) {
    for (let i in data.removed) {
      app.keysOverview[data[i]] && app.keysOverview[data[i]].remove(event)
    }
  }
})




hub.each((property, key) => {
  app.keysOverview.setKey(key + 'init', { message: { text: property } })
})

exports.app = app
exports.hub = hub
