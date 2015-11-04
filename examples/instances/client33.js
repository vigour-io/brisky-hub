'use strict'

var uuid = require('vigour-js/lib/util/uuid')
uuid.val = '3033_NORMAL_CLIENT_' + uuid.val
// var Hub = require('../../lib')
// Hub.prototype.inject(require('vigour-js/lib/observable/storage'))
var hub = require('../dev/ui').hub
// var app = require('../dev/ui').app
var Observable = require('vigour-js/lib/observable')
hub.key = 'hubs'
setTimeout(() => hub.adapter.val = 3033, 100)
// setInterval(() => {
//   // hub.set({
//   //   text: 'no scope 3031'
//   // })
//   hub.set({
//     text: null
//   })
// }, 2000)
