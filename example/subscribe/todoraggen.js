// var Hub = require('../../lib') //eslint-disable-line
var Element = require('vigour-element/lib/element')

var Observable = require('vigour-js/lib/observable')
Observable.prototype.inject(require('vigour-js/lib/operator/subscribe'))
require('./style.less')
var App = require('vigour-element/lib/app') //eslint-disable-line
Element.prototype.inject(
  require('vigour-element/lib/property/text'),
  require('vigour-element/lib/property/css'),
  require('vigour-element/lib/events')
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
  // projectList: {
  //   xx: {},
  //   text: 'projects',
  //   ChildConstructor: new Element({
  //     text: {
  //       $: 'title'
  //     }
  //   }),
  //   $: 'projects'
  // },
  val: data
})

// client.set({
//   projects: {
//     b: {
//       title: 'xxxx'
//     }
//   }
// })
var j = 1

var Event = require('vigour-js/lib/event')
// event.isTriggered = true
var Thing = new Element({
  // css: 'thing',
  val: 'lulz',
  text: 'bla'
  // text: function () {
  //   return this.parent._input
  // }
  // click: {
  //   node: 'button',
  //   text: 'bla',
  //   on: {
  //     click () {
  //
  //     }
  //   }
  // },
  // bla: {
  //   node: 'span',
  //   text: 'xxx'
  // }
}).Constructor
window.cntr = 0
if (app.holder) {
  app.holder.remove()
}
console.time(1)
var holder = new Element()
var event = new Event(holder, 'data')
// event.isTriggered = true

// Thing.prototype.node.style.border = (Math.random() * 10) + 'px solid red'
for (var i = 0 ; i < 3000; i++) {
  // var a = new Observable(i, event)
  // window[i] = a
  holder.setKey(i, new Thing({ text: i }, event), event)
  // holder.setKey(i, new Thing(i, event), event)
  // so no binding on text directly just from the first listener SO we share also the text prop-- this is master move
  // holder[i].text
  // holder.setKey(i, new Thing(i, event), event)
  // Thing.prototype.text.emit('data', i, event)
}

// var ins = Thing.prototype._instances
// for (var i in ins) {
  // ins[i].text.emit('data', i, event)
// }
// so strange why does this not happen ? maybe missing trigger
// Thing.prototype.text._on.data.emitting = true
// maybe make emitting thing on obs?
// we can use it
// Thing.prototype.text.clearContextUp()
// Thing.prototype.text.emit('data', i, event)
event.trigger()
app.setKey('holder', holder)
console.timeEnd(1)

var last = 0
function loop () {
  cntr++
  j++
  for (var i = 0 ; i < 3000 ; i++) {
    app.holder[i].text.val = i + j
  }
  // Thing.prototype.text.clearContextUp()
  // Thing.prototype.text.emit('data', i + j)
  window.requestAnimationFrame(loop)
}
//
setInterval(function () {
  last = cntr
  cntr = 0
  console.log(last , 'fps')
}, 1000)

console.time('updates')
loop()
console.timeEnd('updates')
