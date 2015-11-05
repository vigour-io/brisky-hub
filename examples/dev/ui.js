'use strict'
require('./style.less')

var Element = require('vigour-element')
Element.prototype.inject(
  require('vigour-element/lib/property/text'),
  require('vigour-element/lib/property/transform'),
  require('vigour-element/lib/events/drag')
)
var Observable = require('vigour-js/lib/observable')
var Hub = require('../../lib')
var uikit = require('vigour-uikit')
var uuid = require('vigour-js/lib/util/uuid').val

console.log('ok ....')

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
      require('vigour-js/lib/operator/transform'),
      require('vigour-js/lib/operator/add')
    ],
    $transform: (val) => val === true ? 'Stop updates' : 'Fire updates'
  },
  css: {
    inject: require('vigour-js/lib/operator/transform'),
    $transform: (val) => val === true ? 'ui-button active' : 'ui-button inactive'
  },
  on: {
    click () {
      this._updating.val = !this._updating.val
    }
  }
}).Constructor

console.log('ok ....2')

console.log(uikit.Badge)

var app = global.app = new Element({
  node: document.body,
  rendered: true,
  css: 'app',
  holder: {
    labels: {
      ChildConstructor: uikit.Badge,
      scope:{
        message: { text: hub.adapter.scope } // hub.adapter.scope
      },
      uuid: {
        message: { text: uuid }
      },
      time: {
        message: {
          text: {
            val: now,
            inject: require('vigour-uikit/lib/transform/time')
          }
        }
      },
      upstream: new uikit.InputBadge({
        message: { text: hub.adapter }
      }),
      clock: new uikit.Label({
        text: {
          val: start,
          inject: require('vigour-uikit/lib/transform/time')
        }
      })
    },
    msgcnt: new uikit.Stat({
      title: { text: 'Messages' },
      counter: {
        text: {
          inject: require('vigour-uikit/lib/transform/number'),
          val: msgCount
        }
      }
    }),
    msg: new uikit.Stat({
      title: { text: 'Msg/s' },
      counter: {
        text: {
          inject: require('vigour-js/lib/operator/transform'),
          val: now,
          $transform: (val) => ~~(msgCount.val - msgCount.lastSecond.val)
        }
      }
    }),
    clients: new uikit.Stat({
      status: {
        inject: require('vigour-js/lib/operator/transform'),
        $transform: (val) => val ? 'ok' : 'error',
        val: connected
      },
      title: { text: 'Clients' },
      counter: {
        text: {
          inject: require('vigour-js/lib/operator/transform'),
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

console.log('ok ....3')

app.holder.set({
  buttons: {
    button: new FireButton({
      updating: updating,
      text: { $add: ' "text"' }
    }),
    addfield: new uikit.Button({
      text: {
        val: 'add field: ',
        inject: require('vigour-js/lib/operator/add'),
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
            console.clear()
            console.log('start ---------')
            this.parent.message.text.origin.remove()
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

  if (data.removed) {
    // console.clear()
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
