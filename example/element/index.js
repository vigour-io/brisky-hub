require('./style.less')

'use strict'
var App = require('vigour-element/lib/app')
var Element = require('vigour-element')
Element.prototype
  .inject(require('vigour-element/lib/property/text'))

var app = new App({
  node: document.body
})
