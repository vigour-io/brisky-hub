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
var data = new Observable({
  projects: { a: 'x', b: 'y' }
})
var app = new Element({ //eslint-disable-line
  key: 'app',
  node: document.body,
  val: data
})
var j = 1
var Event = require('vigour-js/lib/event')
var Thing = new Element({
  key: 'thing',
  text () {
    return this.parent._input
  }
}).Constructor
var cntr = 0
console.log('start')
var n = 1e3
console.time('create: ' + n)
var holder = new Element({
  key: 'myholder'
})
var event = new Event(holder, 'data')
for (let i = 0; i < n; i++) {
  holder.setKey(i, new Thing(i, event), event)
  Thing.prototype.text.emit('data', i, event)
}
Thing.prototype.text.emit('data', 'yo', event)
event.trigger()
console.timeEnd('create: ' + n)
function loop () {
  cntr++ //eslint-disable-line
  j++
  for (var i = 0; i < n; i++) {
    holder[i].set(i + j, false)  // = i + j
  }
  var ev = new Event()
  Thing.prototype.text.emit('data', void 0, ev)
  ev.trigger()
  window.requestAnimationFrame(loop)
}

// app.setKey('holder', holder)
app.setKey('holder', new holder.Constructor())
var last = 0
setInterval(function () {
  last = cntr
  cntr = 0
  console.log(last, 'fps')
}, 1000)

console.time('updates')
loop()
console.timeEnd('updates')
