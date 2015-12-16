'use strict'
// var Observable = require('vigour-js/lib/observable')
var colors = require('colors-browserify') //eslint-disable-line
var Hub = require('../../lib')
require('./style.less')
console.line = false

var client = global.client = new Hub({
  key: 'client',
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3032'
  }
})

client.get('shows', {})

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
  title: {
    text: 'SERVER2'
  },
  bla: {
    text: client.get('field', 'loading...')
  }
})

app.title.node.setAttribute('style' , 'x'.rainbow.style)

client.subscribe({
  field: true
}, () => {
  console.log('hey subs gots it!'.rainbow)
})
