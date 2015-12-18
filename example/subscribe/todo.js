'use strict'
var Observable = require('vigour-js/lib/observable') //eslint-disable-line
var colors = require('colors-browserify') //eslint-disable-line
var Hub = require('../../lib')
require('./style.less')
// console.line = false

var client = global.client = new Hub({
  key: 'client',
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3031'
  }
})

client.set({
  tasks: {
    yo: {
      title: 'yuz'
    },
    yo2: {
      title: 'yuz2'
    },
    yo3: {
      title: 'yuz3'
    }
  }
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

Element.prototype.set({
  properties: {
    focus: new Property({
      on: {
        data (data, event) {
          console.log('yo bitch')
          // if (this.parent.val[this.val]) {
          //   if (this.parent.val._focused && this.parent.val._focused._input !== null) {
          //     this.parent.val._focused.css.set({ removeClass: 'focus' })
          //   }
          //   this.parent.val._focused = this.parent.val[this.val]
          //   this.parent.val[this.val].css.set({ addClass: 'focus' })
          //   this.parent.val[this.val].thing.node.focus()
          // }
        }
      }
    })
  }
})

client.get('scroll', {})
// client.get('tasks', {})

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
          client.tasks.clear()
        }
      }
    },
    toggleFocus: {
      node: 'button',
      text: 'randomizer [focus]',
      on: {
        click (e, event) {
          console.clear()
          client.focus.val = Math.random() * 9999
        }
      }
    },
    collection: {
      text: 'collection',
      inject: [
        require('vigour-js/lib/operator/subscribe'),
        require('vigour-js/lib/operator/origin')
      ],
      ChildConstructor: new Element({
        css: 'thing',
        // focus: client.get('focus', {}),
        // titlefield: {
        //   text: {
        //     inject: [
        //       require('vigour-js/lib/operator/subscribe'),
        //       require('vigour-js/lib/operator/transform')
        //     ],
        //     $: '../../title',
        //     $transform (val) {
        //       if (typeof val !== 'string') {
        //         val = ''
        //       }
        //       return 'TASK:' + this.parent.parent.key + ' ' + val.toUpperCase()
        //     }
        //   }
        // },
        text: client.get('focus', 99)
        // blurf: {
        //   text: client.get('focus', 99)
        // },
        // thing: {
        //   node: 'input',
        //   inject: require('vigour-element/lib/property/attributes'),
        //   attributes: {
        //     placeholder: 'Enter text'
        //   },
        //   text: {
        //     inject: require('vigour-js/lib/operator/subscribe'),
        //     $: '../../title'
        //   },
        //   on: {
        //     input () {
        //       this.text.origin.val = this.node.value
        //     },
        //     focus () {
        //       this.parent.focus.origin.val = this.parent.key
        //     },
        //     keyup (e) {
        //       var keyCode = e.keyCode
        //       if (keyCode === 8) {
        //         let node = this.node
        //         if (!node.value) {
        //           let parentNode = node.parentNode
        //           let next = parentNode.previousSibling || parentNode.nextSibling
        //           if (next && next.base) {
        //             this.parent.parent.origin.parent.focus.origin.val = next.base.key
        //           }
        //           this.parent.origin.remove()
        //         }
        //       }
        //     }
        //   }
        // }
      }),
      $origin: client.tasks
      // $: 'tasks'
    }
  },
  val: client
})
//
// var bla = new Observable({
//   on: {
//     data () {
//       console.error('xxxxx!@@#! no')
//     }
//   }
// })
// //
// // bla.val = 'x'
// //
// // var x = new Observable({
// //   val: 'xxx',
// //   inject: require('vigour-js/lib/operator/origin'),
// //   ChildConstructor: new Observable({
// //     bla: {
// //       on: {
// //         data () {
// //           console.log('xxxx')
// //         }
// //       }
// //     }
// //   }),
// //   $origin: {
// //     hh: true
// //   }
// // })

// a --- b -- multiple instances b --- fire all instances / contexts of b!!!!
// console.clear()
