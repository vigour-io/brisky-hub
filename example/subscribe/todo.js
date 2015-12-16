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
    websocket: 'ws://jim.local:3032'
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

client.get('scroll',{})

var app = new App({
  key: 'app',
  node: document.body,
  holder: {
    inject: require('vigour-element/lib/property/scroll/top'),
    scrollTop: {
      inject: require('vigour-js/lib/operator/subscribe'),
      $: 'scroll'
    },
    on: {
      keyup (e) {
        if (e.keyCode === 13) {
          this.collection.origin.set({
            [Math.random()]: {
              title: ''
            }
          })
        }
      }
    },
    addBtn: {
      node: 'button',
      text: 'add something',
      on: {
        click () {
          this.parent.collection.origin.set({
            [Math.random()]: {
              title: ''
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
        titlefield: {
          text: {
            inject: [
              require('vigour-js/lib/operator/subscribe'),
              require('vigour-js/lib/operator/transform')
            ],
            $: '../../title',
            $transform (val) {
              if (typeof val !== 'string') {
                val = ''
              }
              return 'TASK:' + val.toUpperCase()
            }
          }
        },
        thing: {
          node: 'input',
          inject: require('vigour-element/lib/property/attributes'),
          attributes: {
            placeholder: 'Enter text'
          },
          text: {
            inject: require('vigour-js/lib/operator/subscribe'),
            $: '../../title'
          },
          on: {
            input () {
              this.text.origin.val = this.node.value
            },
            keyup (e) {
              if (e.keyCode === 8) {
                let node = this.node
                if (!node.value) {
                  let parentNode = node.parentNode
                  let next = parentNode.previousSibling || parentNode.nextSibling
                  this.parent.origin.remove()
                  if (next) {
                    next.childNodes[1].focus()
                  }
                }
              }
            }
          }
        }
      }),
      $: 'shows'
    }
  },
  val: client
})
