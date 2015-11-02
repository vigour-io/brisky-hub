'use strict'

var uuid = require('vjs/lib/util/uuid')
uuid.val = 'NO_INSTANCE_' + uuid.val

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

app.holder.labels.set({
  a: {
    message: { text: a },
    on: {
      click () {
        a.val++
      }
    }
  }
})

hub.set({
  text: {
    // is this for what gets send out?
    // maybe dont use .val but treat dom events as stremas? so eahc letter you type is send
    inject: [
      require('vjs/lib/operator/transform'),
      require('vjs/lib/operator/type')
    ],
    $type: 'string',
    $transform: (val) => val.toUpperCase()
  },
  adapter: {
    val: 3031,
    token: 'usertoken',
    scope: {
      region: 'DE',
      language: 'en',
      user: 'userid'
    }
  }
})
// setInterval(() => a.val++, 3000)
// setTimeout(() => hub.adapter.val = 3031, 100)
