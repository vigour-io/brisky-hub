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

var a = global.a = new hub.Constructor({
  key: 'a',
  instanceId: 'a'
})

a.on('property', function (data) {
  console.log('property', data, this.path)
})

a.on(function (data) {
  // not having a data listener does not fire property!
  console.log('val', this.path)
})

hub.adapter.listens.val = 3031
// setTimeout(() => {
//   hub.adapter.val = 3031
// }, 100)
