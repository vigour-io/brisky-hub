'use strict'
var Hub = require('../../lib')
var hub = global.hub = new Hub()

require('./style.less')

hub.set({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3031'
  }
})

var Element = require('vigour-element')
var Prop = require('vigour-element/lib/property')
var app = require('vigour-element/lib/app')

app.set({
  holder: {
    ChildConstructor: new Element({
      h: 100,
      w: 400,
      attributes: {
        border: '1px solid blue'
      },
      text: {
        $: 'title'
      }
    }),
    $collection: 'discover.lists.popular',
    val: hub
  },
  title: {
    $: 'discover.lists.popular.1071',
    text: '------->',
    nested: {
      text: {
        $: 'title'
      }
    },
    val: hub
  }
})
