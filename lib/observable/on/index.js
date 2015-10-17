'use strict'
// var On = require('vjs/lib/observable/on/constructor')
// var _setKey = On.prototype.setKey
// var SubsEmitter = require('vjs/lib/observable/subscribe/emitter')
var uuid = require('vjs/lib/util/uuid')

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
      var eventorigin = event.stamp.split('-')[0]

      if (adapaterClient && event.stamp.indexOf(uuid) === 0) {
        adapaterClient.send(this, adapter.parent, data, event)
        // this part is not nessecary when its not my own event!
        if (adapter.parent.clients) {
          adapter.parent.clients.each((client, key) => {
            if (key !== eventorigin && (!adapaterClient || client.origin !== adapaterClient)) {
              // here we have to be smart with stamps -- only send when subscribed this will never run like this!
              client.send(this, adapter.parent, data, event)
            }
          })
        }
      }

    }
  }
}
