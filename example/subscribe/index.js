'use strict'
var Observable = require('vigour-js/lib/observable')
var colors = require('colors-browserify') //eslint-disable-line

var Syncable = require('../../lib/syncable/')
var Hub = require('../../lib')
// var url = require('url')
require('./style.less')
// console.line = false

var client = global.client = new Hub({
  key: 'client',
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: {
      val: 'ws://youzi.local:3032',
      inject: require('vigour-js/lib/observable/storage')
    }
  }
})

// Syncable.prototype.inject(require('vigour-js/lib/observable/storage'))
// client.get('scroll',)

// client.adapter.websocket.val = 'ws://localhost:3031'

client.get('scroll', {})
client.get('field.flapper', 'loading it!')

var App = require('vigour-element/lib/app')

var Element = require('vigour-element')
Element.prototype.inject(
  require('vigour-element/lib/property/text'),
  require('vigour-element/lib/property/html'),
  require('vigour-element/lib/property/css'),
  require('vigour-element/lib/events'),
  require('vigour-element/lib/property/transform'),
  require('vigour-element/lib/events/drag')
)

client.get('scroll', {})

var app = new App({
  key: 'app',
  node: document.body,
  properties: {
    data: Observable
  },
  unsubscribeit: {
    css: 'button',
    text: {
      inject: [
        require('vigour-js/lib/operator/transform'),
        require('vigour-js/lib/operator/subscribe'),
        require('vigour-js/lib/operator/add')
      ],
      $: '../../data',
      $transform (val) {
        return val === false ? 'resubscribe!' : 'unsubscribe'
      },
      $add (val) {
        let target = this.parent._stored || this.parent.parent.data._input
        return '[' + target.path.join('.') + ']'
      }
    },
    on: {
      click () {
        var input = this.parent.data._input
        if (input) {
          this._stored = input
        }
        console.clear()
        this.parent.data.val = input ? false : this._stored
      }
    }
  },
  titlex: {
    node: 'input',
    text: client.adapter.websocket,
    on: {
      keyup () {
        this.text.origin.val = this.node.value
      }
    }
  },
  connected: {
    css: {
      val: client.adapter.websocket.connected,
      inject: require('vigour-js/lib/operator/transform'),
      $transform (val) {
        return val ? 'ok' : 'no'
      }
    }
  },
  bla: {
    node: 'input',
    text: {
      inject: require('vigour-js/lib/operator/subscribe'),
      $: 'data'
    },
    on: {
      keyup () {
        this.text.origin.val = this.node.value
      }
    }
  },
  data: client.scroll
})

app.titlex.node.setAttribute('style', 'x'.rainbow.style)
