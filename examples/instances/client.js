'use strict'

var uuid = require('vigour-js/lib/util/uuid')
uuid.val = '3031_NORMAL_CLIENT_' + uuid.val

// var Hub = require('../../lib')
// Hub.prototype.inject(require('vigour-js/lib/observable/storage'))

var hub = require('../dev/ui').hub
// var app = require('../dev/ui').app
var Observable = require('vigour-js/lib/observable')
hub.key = 'hubs'
var a = new Observable({
  key: 'a',
  val: 0,
  inject: require('vigour-js/lib/observable/storage')
})

setInterval(() => a.val++, 3000)
setTimeout(() => hub.adapter.val = 3031, 100)

//adapter should not rly update its clients? -- no just not updates when it allrdy running

// setInterval(() => {
//   // hub.set({
//   //   text: 'no scope 3031'
//   // })
//   hub.set({
//     text: null
//   })
// }, 2000)
