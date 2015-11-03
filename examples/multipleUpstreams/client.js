'use strict'

var uuid = require('vjs/lib/util/uuid')
uuid.val = 'SCOPE_INSTANCE_' + uuid.val

var Hub = require('../../lib')
// Hub.prototype.inject(require('vjs/lib/observable/storage'))
var hub = require('../dev/ui').hub
var app = require('../dev/ui').app
var Observable = require('vjs/lib/observable')

var a = new Observable({
  key: 'a',
  val: 0,
  inject: require('vjs/lib/observable/storage')
})

// app.holder.labels.set({
//   a: {
//     message: { text: a },
//     on: {
//       click () {
//         a.val++
//       }
//     }
//   }
// })

hub.set({
  // text: {
  //   // is this for what gets send out?
  //   // maybe dont use .val but treat dom events as stremas? so eahc letter you type is send
  //   inject: [
  //     require('vjs/lib/operator/transform'),
  //     require('vjs/lib/operator/type')
  //   ],
  //   $type: 'string',
  //   $transform: (val) => val.toUpperCase()
  //
})
// setInterval(() => a.val++, 3000)
setTimeout(() => hub.adapter.val = {
  scope: 'meta',
  val: 3031
}, 300)

// setInterval(() => a.val++, 3000)
// setTimeout(() => hub.adapter.val = {
  // val: 3031,
  // scope: 'meta'
// }, 1300)
