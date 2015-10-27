'use strict'
var Hub = require('../../lib')
var hub = global.hub = new Hub({
  key: 'orig',
  trackInstances: true,
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection () {
        console.log('connected!', this.path)
      }
    }
  }
})

setTimeout(() => {
  hub.adapter.val = 3031
}, 100)
