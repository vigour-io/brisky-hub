'use strict'
var Observable = require('vigour-js/lib/observable')
var colors = require('colors-browserify') //eslint-disable-line
var Hub = require('../../lib')
require('./style.less')
console.line = false

var client = global.client = new Hub({
  key: 'client',
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3031'
  }
})

var App = require('vigour-element/lib/app')

var Element = require('vigour-element')
Element.prototype.inject(
  require('vigour-element/lib/property/text'),
  require('vigour-element/lib/property/css'),
  require('vigour-element/lib/events'),
  require('vigour-element/lib/property/transform'),
  require('vigour-element/lib/events/drag')
)

var app = new App({
  key: 'app',
  node: document.body,
  // btn: {
  //   node: 'button',
  //   text: 'ok lets unsubscribe',
  //   on: {
  //     click () {
  //       console.clear()
  //       if (app._input !== client) {
  //         app.val = client
  //         this.text.val = 'ok lets unsubscribe'
  //       } else {
  //         app.val = false
  //         this.text.val = 'ok lets subscribe'
  //       }
  //       // obs.val = obs._input === client ? 'haha' : client
  //     }
  //   }
  // },
  // removebtn: {
  //   node: 'button',
  //   text: 'REMOVE',
  //   on: {
  //     click () {
  //       console.clear()
  //       if (this.parent.textfield) {
  //         this.parent.textfield.remove()
  //       } else {
  //         this.parent.set({textfield:{ text: { $: 'mybitch' }}})
  //       }
  //     }
  //   }
  // },
  // textfield: {
  //   css: 'thing',
  //   node: 'input',
  //   text: {
  //     inject: require('vigour-js/lib/operator/subscribe'),
  //     $: 'mybitch'
  //   },
  //   on: {
  //     input () {
  //       this.text.origin.val = this.node.value
  //     }
  //   }
  // },
  addBtn: {
    node: 'button',
    text: 'add something',
    on: {
      click () {
        this.parent.collection.origin.set({
          [Math.random()]:{
            title: Math.random()
          }
        })
      }
    }
  },
  collection: {
    text: 'collection',
    inject: require('vigour-js/lib/operator/subscribe'),
    ChildConstructor: new Element({
      css: 'thing',
      node: 'input',
      text: {
        inject: require('vigour-js/lib/operator/subscribe'),
        $: 'title'
      },
      on: {
        input () {
          var v = this.node.value
          if (!v) {
            this.origin.remove()
          } else {
            this.text.origin.val = this.node.value
          }
        }
      }
    }),
    $: 'shows'
  },
  val: client
})

app.subscribe({
  $upward: {
    shows: {
      $any: {
        title: true
      }
    }
  }
})
