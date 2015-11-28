'use strict'
require('./style.less')
var Hub = require('../../lib')
var hub = global.hub = new Hub({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3031'
  }
})

var App = require('vigour-element/lib/app')
var Element = require('vigour-element')
Element.prototype
  .inject(require('vigour-element/lib/property/text'))

var app = new App({
  node: document.body,
  bla: {
    text: require('vigour-js/lib/util/uuid').val
  },
  text: {
    val: 'hey!'
  }
})
