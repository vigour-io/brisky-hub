'use strict'

var uuid = require('vjs/lib/util/uuid')
uuid.val = '3031_NORMAL_CLIENT_' + uuid.val

// var Hub = require('../../lib')
// Hub.prototype.inject(require('vjs/lib/observable/storage'))

var hub = require('../dev/ui').hub
// var app = require('../dev/ui').app
var Observable = require('vjs/lib/observable')
hub.key = 'hubs'
var a = new Observable({
  key: 'a',
  val: 0,
  inject: require('vjs/lib/observable/storage')
})

setInterval(() => a.val++, 3000)
setTimeout(() => hub.adapter.val = 3031, 100)
// setInterval(() => {
//   // hub.set({
//   //   text: 'no scope 3031'
//   // })
//   hub.set({
//     text: null
//   })
// }, 2000)
