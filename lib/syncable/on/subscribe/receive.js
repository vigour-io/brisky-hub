'use strict'
var Event = require('vigour-js/lib/event')
exports.define = {
  receiveSubscription (subscriptions, id, event) {
    console.log(' lulzzzzzzzz incoming subs!', id, subscriptions, event.stamp)
    var hub = this
    var ev = new Event('data')
    for (var field in subscriptions) {
      walk(subscriptions[field], field)
    }

    // get client by id!
    function walk (subscription, field) {
      var target = hub.get(field, {})
      // target
      for (var subs in subscription) {
        for (var type in subscription[subs]) {
          if (subs === '$') {
            subs = true
          }
          if (type === 'data') {
            target.subscribe(subs, type, [ function (data, event, client) {
              client.send(this, hub, data, event, subscriptions)
            }, hub.clients[id] ], void 0, true, ev)
          }
        }
      }
      ev.trigger()
    }
  }
}
