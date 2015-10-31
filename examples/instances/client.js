'use strict'
var uuid = require('vjs/lib/util/uuid')
uuid.val = 'NO_INSTANCE_' + uuid.val
var hub = require('../dev/ui').hub
var app = require('../dev/ui').app
var Observable = require('vjs/lib/observable')
var a = new Observable({
  key: 'a',
  val: 0,
  inject: require('vjs/lib/observable/storage')
})

app.holder.labels.set({
  a: { message: { text: a } }
})

setInterval(() => a.val++, 3000)
setTimeout(() => hub.adapter.val = 3031, 100)
