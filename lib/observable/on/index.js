'use strict'
var uuid = require('vjs/lib/util/uuid').val

exports.on = {
  data: {
    adapter (data, event) {
      // console.log('----', this.path, event.stamp)
      var adapter
      var parent = this
      while (!adapter && parent) {
        adapter = parent.adapter
        if (!adapter) {
          parent = parent.parent
        }
      }

      if (!adapter) {
        parent.emit('error', 'no adapter yet')
        return
      }

      let adapaterClient = adapter.client
      let eventorigin = (
          event.stamp.indexOf &&
          event.stamp.indexOf('-') &&
          event.stamp.slice(0, event.stamp.indexOf('-'))
        ) || uuid

        // console.log('2----', this.path, event.stamp)

      if (adapaterClient && !event.upstream) {
        // console.log('3----', this.path, event.stamp, event.origin.path)
        adapaterClient.send(this, adapter.parent, data, event)
      }
      // make this an option -- adapter.all
      // this part is not nessecary when its not my own event!
      if (adapter.parent.clients) {
        adapter.parent.clients.each((client, key) => {
          console.log('<-----'.red, eventorigin, key)
          client = client.origin
          if (key !== eventorigin &&
            client !== event.client &&
            (!adapaterClient || client !== adapaterClient)
          ) {
            client.send(this, adapter.parent, data, event)
          } else {
            // console.log('6----', this.path, !!event.val, event.stamp, event.origin.path)
          }
        })
      }
    }
  }
}

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
