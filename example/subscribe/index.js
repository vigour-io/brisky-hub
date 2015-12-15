'use strict'
var Observable = require('vigour-js/lib/observable')
var colors = require('colors-browserify') //eslint-disable-line
var Hub = require('../../lib')
require('./style.less')

var client = global.client = new Hub({
  key: 'client',
  adapter: {
    // id: 'testclient',
    inject: require('../../lib/protocol/websocket'),
    // inject: require('../../lib/protocol/mock'),
    websocket: 'ws://localhost:3031'
    // mock: 'testserver2'
  }
  // time: 0
})

// console.line = false


// var randomObs = new Observable({
//   time: 'hahahahahaha'
// })

// var Element = require('vigour-element')
// var App = require('vigour-element/lib/app')

// Element.prototype.inject(
//   require('vigour-js/lib/operator/subscribe'),
//   require('vigour-element/lib/property/text'),
//   require('vigour-element/lib/property/css'),
//   require('vigour-element/lib/property/style')
// )

// var Property = require('vigour-element/lib/property')
// Property.prototype.inject(
//   require('vigour-js/lib/operator/subscribe')
// )

// var app = new App({
//   key: 'app',
//   node: document.body,
//   addbtn: {
//     node: 'button',
//     text: 'add show',
//     on: {
//       click () {
//         this.parent.origin.set({
//           shows: { [Date.now()]: { title: 'wow' } }
//         })
//       }
//     }
//   },
//   bla: {
//     ChildConstructor: new Element({
//       css: 'thing',
//       text: { $: 'title' }
//     }),
//     $: 'shows'
//   },
//   james: {
//     node: 'input',
//     text: { $: 'time' },
//     on: {
//       keyup () {
//         this.text.origin.val = this.node.value
//       }
//     }
//   },
//   yuzi: {
//     node: 'button',
//     text: 'click me!',
//     on: {
//       click () {
//         client.set({ yuzi: 'yuzi' })
//         client.time.val = client.yuzi
//       }
//     }
//   },
//   jamesx: {
//     node: 'button',
//     text: 'click me if you dare',
//     on: {
//       click () {
//         console.clear()
//         client.set({ james: 'james' })
//         client.set({ yuzi: client.james })
//         client.time.val = client.yuzi
//       }
//     }
//   },
//   togglehub: {
//     node: 'button',
//     text: 'togglehub',
//     on: {
//       click () {
//         console.clear()
//         console.log('TOGGLE SHINY!'.rainbow, 'hubs:', this.parent._input === client ? 'NO!'.red : 'YES!'.green)
//         if (this.parent._input === client) {
//           this.parent.val = randomObs
//         } else {
//           console.log('hey hey hey')
//           this.parent.val = client
//         }
//       }
//     }
//   },
//   val: client
// })

// eerst normale method later pas fancyness met on automatisch parsen

// var time = client.get('time', {})
// var a = new Observable({
//   bla: 'xxx'
//   // bla: time
// })

var ref = new Observable({
  one: {
    two: {}
  }
})

var MockSyncable = new Observable({
  properties: {
    _lastStamp: true
  },
  define: {
    // this is fired for every removed listener on syncable
    set (val, event) {
      var ret = Observable.prototype.set.apply(this, arguments)
      if (event.stamp) {
        this.setKey('_lastStamp', event.stamp)
      }
      return ret
    },

    onSubRemove (emitter) {
      console.log('removing, emitter:'.bold.red, emitter)
    },
    // this is fired when subscription parsing touches syncable
    onSub (data, event, emitter, pattern, current, mapvalue, map, context) {
      // console.log('--------- handleSubscribe ----------')
      // console.log('- emitter:'.bold, emitter.path.join('.'))
      // console.log('-- pattern:'.bold, pattern.path.join('.'), pattern)
      // console.log('-- syncable:'.bold, this.path.join('.'))
      var hashed = emitter.key
      if (this.substore) {
        if (this.substore[hashed]) {
          return
        }
      } else {
        this.substore = {}
      }
      this.substore[hashed] = true

      var serializedPattern = pattern.serialize(function (property, key) {
        if (key !== 'key') {
          return true
        }
      })

      console.log('setting', JSON.stringify(serializedPattern, false, 2))
      this.set(serializedPattern, new Event(this, 'data'))
    }
  },
  ChildConstructor: 'Constructor'
}).Constructor

client = new MockSyncable({
  key: 'client'
})

var Event = require('vigour-js/lib/event')

var a = new Observable({
  key: 'a',
  val: client
})

var key1 = 'smurk'
var key2 = 'fool'
// this should add a listener!!!
var sub1 = a.subscribe({
  b: true
}, [ function (data) {
  console.log('sub1 fires:'.rainbow, data)
}, client], key1)

// console.log('before running sub1:', JSON.stringify(sub1.pattern, function (key, value) {
//   if (key === 'parent' || key === '_parent' || key === '_uid' || key === 'key') {
//     return
//   }
//   return value
// }, 2))

sub1.run()

// console.log('after running sub1:', JSON.stringify(sub1.pattern, function (key, value) {
//   if (key === 'parent' || key === '_parent' || key === '_uid' || key === 'key') {
//     return
//   }
//   return value
// }, 2))


sub1.remove()

var sub2 = a.subscribe({
  b: true
}, [ function (data) {
  console.log('sub2 fires:'.rainbow, data)
}, client], key1)

// console.log('before running sub2', JSON.stringify(sub2.pattern, function (key, value) {
//   if (key === 'parent' || key === '_parent' || key === '_uid' || key === 'key') {
//     return
//   }
//   return value
// }, 2))

// sub2.run()

client.set({
  b: 400
}, new Event(client, 'data'))

// sub2.run()
