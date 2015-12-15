'use strict'
var Observable = require('vigour-js/lib/observable')
var colors = require('colors-browserify') //eslint-disable-line
var Hub = require('../../lib')
require('./style.less')

var client = global.client = new Hub({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3031'
  }
})

console.line = false

var randomObs = new Observable({
  time: 'hahahahahaha'
})

var Element = require('vigour-element')
var App = require('vigour-element/lib/app')

Element.prototype.inject(
  require('vigour-js/lib/operator/subscribe'),
  require('vigour-element/lib/property/text'),
  require('vigour-element/lib/property/css'),
  require('vigour-element/lib/property/style')
)

var Property = require('vigour-element/lib/property')
Property.prototype.inject(
  require('vigour-js/lib/operator/subscribe')
)

var app = new App({
  key: 'app',
  node: document.body,
  addbtn: {
    node: 'button',
    text: 'add show',
    on: {
      click () {
        this.parent.origin.set({
          shows: { [Date.now()]: { title: 'wow' } }
        })
      }
    }
  },
  bla: {
    ChildConstructor: new Element({
      css: 'thing',
      text: { $: 'title' }
    }),
    $: 'shows'
  },
  james: {
    node: 'input',
    text: { $: 'time' },
    on: {
      keyup () {
        this.text.origin.val = this.node.value
      }
    }
  },
  yuzi: {
    node: 'button',
    text: 'click me!',
    on: {
      click () {
        client.set({ yuzi: 'yuzi' })
        client.time.val = client.yuzi
      }
    }
  },
  jamesx: {
    node: 'button',
    text: 'click me if you dare',
    on: {
      click () {
        console.clear()
        client.set({ james: 'james' })
        client.set({ yuzi: client.james })
        client.time.val = client.yuzi
      }
    }
  },
  togglehub: {
    node: 'button',
    text: 'togglehub',
    on: {
      click () {
        console.clear()
        console.log('TOGGLE SHINY!'.rainbow, 'hubs:', this.parent._input === client ? 'NO!'.red : 'YES!'.green)
        if (this.parent._input === client) {
          this.parent.val = randomObs
        } else {
          console.log('hey hey hey')
          this.parent.val = client
        }
      }
    }
  },
  val: client
})
