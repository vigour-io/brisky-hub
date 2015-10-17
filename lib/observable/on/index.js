'use strict'
// var On = require('vjs/lib/observable/on/constructor')
// var _setKey = On.prototype.setKey
// var SubsEmitter = require('vjs/lib/observable/subscribe/emitter')

// var HubOn = new On({
//   // inject: require('vjs/lib/methods/lookup'),
//   // replace this later!
//   define: {
//     setKey (key, val, event) {
//       var ret = _setKey.apply(this, arguments)
//       if (val instanceof SubsEmitter) {
//         // var up = this.lookup('upstream')
//         var adapter = this.getRoot().adapter
//         // previous event stamp of subscription
//         adapter.subscribe(val._pattern, void 0, void 0)
//       }
//       return ret
//     }
//   }
// })
//
// exports.properties = {
//   on: {
//     val: HubOn, override: '_on'
//   }
// }

exports.on = {
  data: {
    adapter (data, event) {
      var adapter
      var parent = this
      while (!adapter && parent) {
        adapter = parent.adapter
        if (!adapter) {
          parent = parent.parent
        }
      }
      if (!adapter) {
        throw new Error('cannot find adapter!')
      }
      var adapaterClient = adapter.client
      if (adapter.parent.clients) {
        adapter.parent.clients.each((client, key) => {
          if (!adapaterClient || client.origin !== adapaterClient) {
            client.send(this, data, event)
          }
        })
      }
    }
  }
}
