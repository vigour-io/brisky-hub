'use strict'
var Hub = require('../../lib')

var hub = global.hub = new Hub({
  key: 'orig',
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
  scope: 'a'
})

hub.set({
  blax: {
    a: true
  }
})

console.log('bitches')

// setTimeout(function() {
//   // console.log(hub.blax)
//   hub.blax.a.remove()
//   a.set({
//     text: 'instance a lezzgo' //need update blockers on set it finaly happened!
//   })
//   hub.set({
//     text2: 'non-instance'
//   })
// },800)

// a.on('property', function (data) {
//   console.log('property', data, this.path)
// })

// a.on(function (data) {
//   // not having a data listener does not fire property!
//   console.log('val', data, this.path)
// })

hub.adapter.listens.val = 3031
// setTimeout(() => {
//   hub.adapter.val = 3031
// }, 100)
