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

var Input = require('vigour-uikit/lib/form/input')

var app = new App({
  node: document.body,
  uuid: {
    text: require('vigour-js/lib/util/uuid').val
  },
  // crap: new Input({
    // text: hub.adapter.scope
  // }),
  something: new Input({
    text: hub.get('text', {})
  })
})
