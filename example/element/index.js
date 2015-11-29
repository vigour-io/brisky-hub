'use strict'
require('./style.less')
var Hub = require('../../lib')
var hub = global.hub = new Hub()
var focused = hub.get('focus', {})
var me

var make = function (data) {
  if (data && data.added) {
    app.setKey(data.added[0], {
      css: {
        val: focused,
        inject: require('vigour-js/lib/operator/transform'),
        $transform: function (val) {
          // console.log(val)
          app.set({ xxx: { text: '----> ' + this.origin.key } })
          if (this.origin.key === data.added[0]) {
            if (data.added[0] === me.key) {
              return 'jan myself'
            }
            return 'jan colors'
          }
          return 'jan'
        }
      },
      text: data.added[0],
      x: this[data.added[0]].get('x', 0),
      y: this[data.added[0]].get('y', 0)
    })
  }
}

hub.get('clients', {}).on('property', make)

hub.set({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3031'
  }
})

var App = require('vigour-element/lib/app')
var app

var Element = require('vigour-element')
Element.prototype
  .inject(
    require('vigour-element/lib/property/text'),
    require('vigour-element/lib/property/css'),
    require('vigour-element/lib/property/transform')
  )

var Input = require('vigour-uikit/lib/form/input')

var speed = hub.get('speed', 15)
speed.inject(require('vigour-js/lib/operator/type'))
speed.set({ $type: 'number' })

me = global.me = hub.get(['clients', hub.adapter.id], {
  x: 0,
  y: 0
})

window.onfocus = function () {
  focused.val = false
  focused.val = me
}

focused.val = me

speed.inject(require('vigour-js/lib/operator/type'))
speed.set({ $type: 'number' })

var firin
var x
var y

function firegun () {
  if (x || y) {
    firin = true
    var xVal = me.x.val
    var yVal = me.y.val
    if (xVal > window.innerWidth - 70) {
      xVal = window.innerWidth - 100
    }
    if (xVal < 0) {
      xVal = 20
    }
    if (yVal > window.innerHeight - 70) {
      yVal = window.innerHeight - 100
    }
    if (yVal < 0) {
      yVal = 20
    }
    if (x) {
      me.x.val = xVal + x
    }
    if (y) {
      me.y.val = yVal + y
    }
    window.requestAnimationFrame(firegun)
  }
}

app = new App({
  node: document.body,
  scope: new Input({
    text: {
      val: hub.adapter.scope,
      inject: [
        require('vigour-js/lib/operator/transform'),
        require('vigour-js/lib/operator/type')
      ],
      $type: 'string',
      $transform: (val) => val || 'scope'
    }
  }),
  uuid: {
    text: require('vigour-js/lib/util/uuid').val
  },
  speed: new Input({
    text: speed
  }),
  on: {
    keydown: function (e, event) {
      var code = e.keyCode
      if (code === 37) {
        x = -speed.val
      } else if (code === 39) {
        x = speed.val
      }
      if (code === 38) {
        y = -speed.val
      } else if (code === 40) {
        y = speed.val
      }
      if (!firin) {
        firegun()
      }
    },
    keyup: function (e, event) {
      var code = e.keyCode
      if (code === 37) {
        x = x + speed.val
      }
      if (code === 39) {
        x = x - speed.val
      }
      if (code === 38) {
        y = y + speed.val
      }
      if (code === 40) {
        y = y - speed.val
      }
      if (!x && !y) {
        firin = false
      }
    }
  }
})

make.call(hub.clients, {added: [ hub.adapter.id ]})
