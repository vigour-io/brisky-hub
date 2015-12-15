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

var a = new Observable({
  key: 'a',
  // val: client,
  b: {},
  c: {}
})

var key1 = 'smurk'
var key2 = 'fool'
// this should add a listener!!!
var sub1 = a.subscribe({
  b: true
}, [ function (data) {
  console.log('1111fire! subs'.rainbow, data)
}, client], key1)

var sub2 = a.subscribe({
  b: true
}, [ function (data) {
  console.log('2222fire! subs'.rainbow, data)
}, client], key2)

// sub.remove()

console.log('---run 1')
sub1.run(void 0, void 0, key1)
console.log('---run 2')
sub1.run(void 0, void 0, key2)
// sub2.run(void 0, void 0, key2)
console.log('---run all')
sub1.run()
console.log('---run 1 and 2')
sub1.run(void 0, void 0, [key1, key2])

// sub.remove()
// a.val = false

// unsusbcribe!

// app.set({ fieldx: {
//   css: 'thing',
//   s: { text: '???' }
//   // text: a
// }})

// console.clear()
// console.log('now subscribe on a.bla')
// a.val = client

// setTimeout(function () {
// app.val = client
// }, 500)
// app.youzi.val = client2

/*
   t -> *
   t --> y --> *
   t --> y --> j ---> *
   t --> y --> *

   t --> y --> j ---> *
    // data references ---> james --- > origin t krijg ik data reference j mee
 */
