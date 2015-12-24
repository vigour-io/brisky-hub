var Hub = require('../../lib') //eslint-disable-line
var Element = require('vigour-element/lib/element')

var Observable = require('vigour-js/lib/observable')
Observable.prototype.inject(require('vigour-js/lib/operator/subscribe'))

var App = require('vigour-element/lib/app') //eslint-disable-line
Element.prototype.inject(
  require('vigour-element/lib/property/text')
)

// var Header = require('../common/components/header/')
// var Projects = require('./components/projects')
// var Footer = require('../common/components/footer')
//
// app.set({
//   header: Header,
//   container: {
//     css: 'main',
//     projectsList: Projects
//   },
//   footer: Footer
// })

var data = new Observable({
  projects: { a: 'x', b: 'y' }
})

// console.line = false

// var client = global.client = new Hub({
//   key: 'client',
//   adapter: {
//     inject: require('../../lib/protocol/websocket'),
//     websocket: 'ws://localhost:3031'
//   }
//   // projects: {
//   //   a: {
//   //     title: 'xxx'
//   //   }
//   // }
// })
//
// data.subscribe({
//   a: true
// })

var app = new Element({ //eslint-disable-line
  key: 'app',
  node: document.body,
  projectList: {
    xx: {},
    text: 'projects',
    ChildConstructor: new Element({
      text: {
        $: 'title'
      }
    }),
    $: 'projects'
  },
  val: data
})

// client.set({
//   projects: {
//     b: {
//       title: 'xxxx'
//     }
//   }
// })

var Event = require('vigour-js/lib/event')
var holder = new Element()
app.setKey('holder', holder)
var event = new Event(holder, 'data')
// event.isTriggered = true
console.time(1)
var Thing = new Element({
  nested: {
    text: 'bla'
  }
}).Constructor
for (var i = 0 ; i < 1000 ; i++) {
  var a = new Observable(i)
  window[i] = a
  holder.setKey(i, new Thing({
    nested: {
      text: a
    },
    flups: {
      text: a
    },
    smur: {
      text: a
    },
    drully: {
      text: a
    }
  }), event)
  // making 5k elements
  // 90k observables
  // 40 k references
  //
  // a.val = i * i
  //
  // can become a lot faster of course
}
// event.trigger()
console.timeEnd(1)

console.time(2)
holder.remove()
console.timeEnd(2)
