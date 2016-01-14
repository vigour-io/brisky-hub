'use strict'
var Event = require('vigour-js/lib/event')
var setByPath = require('vigour-js/lib/util/setwithpath')
exports.define = {
  receiveSubscription (subscriptions, id, event) {
    var hub = this
    var ev = new Event('data')
    for (var field in subscriptions) {
      walk(subscriptions[field], field)
    }
    // get client by id!
    function walk (subscription, field) {
      var target = field === '$' ? hub : hub.get(field, {})
      // target
      for (var subs in subscription) {
        for (var type in subscription[subs]) {
          if (subs === '$') {
            subs = true
          }
          if (type === 'property') {
            var client = hub.clients[id]
             target.subscribe(subs, type, [ function (data, event, client) {
                // console.log(type)
                var datax = {}
                this.each(function (p, key) {
                  datax[key] = {}
                })
                var thing = {}
                setByPath(thing, this.path, datax)
                client.connection.origin.push({
                  stamp: event.stamp,
                  set: thing
                })
            }, client], id, true, ev)
          } else {
            target.subscribe(subs, type, [ function (data, event, client) {
              client.send(this, hub, data, event)
            }, hub.clients[id] ], id, true, ev)
          }
        }
      }
    }
    ev.trigger()
  }
}
