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
        // console.log('CONNECTION')
      },
      close () {
        connected.val = false
        // console.log('close')
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

var FireButton = new uikit.Button({
  properties: {
    updating (val) {
      this._updating = val
      this.set({
        text: val,
        css: val
      })
    }
  },
  text: {
    inject: [
      require('vjs/lib/operator/transform'),
      require('vjs/lib/operator/add')
    ],
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
      scope: new uikit.InputBadge({
        message: { text: hub.adapter.scope }
      }),
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

app.holder.set({
  buttons: {
    button: new FireButton({
      updating: updating,
      text: { $add: ' "text"' }
    }),
    addfield: new uikit.Button({
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
    }),
    addfields: new FireButton({ updating: addfields })
  }
})

app.set({
  keysOverview: {
    css: 'labels',
    properties: {
      text: null
    },
    ChildConstructor: new uikit.InputBadge({
      removebtn: {
        text: 'x',
        on: {
          click (data, event) {
            this.parent.message.text.origin.remove(event)
          }
        }
      }
    }).Constructor // allways get constructor when passing base
  }
})

hub.on(function (data) {
  console.log('---', data)
})

hub.on('property', function (data, event) {
  if (data.added) {
    for (let i in data.added) {
      app.keysOverview.setKey(data.added[i], { message: { text: this[data.added[i]] } }, event)
    }
  }

  console.log('propz', data, event)
  if (data.removed) {
    for (let i in data.removed) {
      app.keysOverview[data.removed[i]] && app.keysOverview[data.removed[i]].remove()
    }
  }
})

hub.each((property, key) => {
  app.keysOverview.setKey(key, { message: { text: property } })
})

exports.app = app
exports.hub = hub
