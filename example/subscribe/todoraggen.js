'use strict'
var Observable = require('vigour-js/lib/observable')
var colors = require('colors-browserify') //eslint-disable-line
var Hub = require('../../lib')
require('./style.less')
// console.line = false

var client = global.client = new Hub({
  // key: 'client',
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3031'
  },
  levelup: 'hubson'
})

var App = require('vigour-element/lib/app')

var Element = require('vigour-element')
Element.prototype.inject(
  require('vigour-element/lib/property/text'),
  require('vigour-element/lib/property/css'),
  require('vigour-element/lib/events'),
  require('vigour-element/lib/property/transform'),
  require('vigour-element/lib/events/drag'),
  require('vigour-element/lib/property/background/image')
)

var Property = require('vigour-element/lib/property')

client.get('scroll', {})

client.subscribe({
  focus: true,
  img2: {
    png: true
  }
}, function () {})

var app = new App({ //eslint-disable-line
  key: 'app',
  node: document.body,
  image: {
    inject: require('vigour-js/lib/operator/add'),
    val: 'data:image/png;base64,',
    $add: client.get('img2.png', '')
  },
  holder: {
    inject: require('vigour-element/lib/property/scroll/top'),
    scrollTop: {
      inject: require('vigour-js/lib/operator/subscribe'),
      $: 'scroll'
    },
    on: {
      keydown (e, event) {
        if (e.keyCode === 13) {
          this.addBtn.emit('click', e, event)
        }
      }
    },
    addBtn: {
      node: 'button',
      text: 'add something',
      on: {
        click (e, event) {
          var key = Date.now()
          this.parent.collection.origin.set({
            [key]: { title: '' }
          }, event)
          client.focus.val = key
        }
      }
    },
    clearBtn: {
      node: 'button',
      text: 'remove all',
      on: {
        click (e, event) {
          client.shows.clear()
        }
      }
    },
    collection: {
      text: 'collection',
      properties: {
        focus: new Property({
          on: {
            data (data, event) {
              if (this.parent.val[this.val]) {
                if (this.parent.val._focused && this.parent.val._focused._input !== null) {
                  this.parent.val._focused.css.set({ removeClass: 'focus' })
                }
                this.parent.val._focused = this.parent.val[this.val]
                this.parent.val[this.val].css.set({ addClass: 'focus' })
                this.parent.val[this.val].thing.node.focus()
              }
            }
          }
        })
      },
      focus: {
        val: client.get('focus', {})
      },
      inject: require('vigour-js/lib/operator/subscribe'),
      ChildConstructor: new Element({
        css: 'thing',
        on: {
          new () {
            if (this.key === this.parent.origin.parent.focus.val) {
              this._frame = window.requestAnimationFrame(() => {
                this.parent.origin.parent.focus.emit('data')
              })
            }
          },
          remove () {
            window.cancelAnimationFrame(this._frame)
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
            focus () {
              // this.parent.parent.origin.parent.focus.origin.val = this.parent.key
            },
            keyup (e) {
              var keyCode = e.keyCode
              if (keyCode === 8) {
                let node = this.node
                if (!node.value) {
                  let parentNode = node.parentNode
                  let next = parentNode.previousSibling || parentNode.nextSibling
                  if (next) {
                    this.parent.parent.origin.parent.focus.origin.val = next.base.key
                  }
                  this.parent.origin.remove()
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

//a --- b -- multiple instances b --- fire all instances / contexts of b!!!!
