'use strict'
require('./style.less')
var Element = require('element')
var Observable = require('vjs/lib/observable')

Element.prototype.inject(
  require('element/lib/property/text'),
  require('element/lib/property/transform'),
  require('element/lib/property/css'),
  require('element/lib/events/drag')
)

exports.Input = new Element({
  label: {
    text: 'text!'
  },
  css: 'ui-input',
  input: {
    node: 'textarea',
    on: {
      keyup: function () {
        this.text.origin.val = this.node.value
      }
    }
  }
}).Constructor

exports.Topbar = new Element({
  css: 'topbar'
}).Constructor

exports.Button = new Element({
  css: 'ui-button',
  text: 'this is a button'
}).Constructor

exports.Label = new Element({
  node: 'span',
  css: 'ui-label',
  text: 'this is a label'
}).Constructor

exports.Stat = new Element({
  properties: {
    status: new Observable({
      on: {
        data () {
          this.parent.oval.inner.set({
            css: 'inner ' + this.val
          })
        }
      }
    })
  },
  css: 'ui-stat',
  counter: {},
  title: {
    text: 'Counter'
  },
  oval: {
    inner: {}
  },
  on: {
    parent: {
      label () {
        // val
      }
    }
  }
}).Constructor

// this.title.text.val = this.key
