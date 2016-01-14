'use strict'
// move to adapter much better
var Event = require('vigour-js/lib/event')
var setByPath = require('vigour-js/lib/util/setwithpath')
exports.define = {
  receiveSubscription (subscriptions, id, event) {
    var hub = this
    var ev = new Event('data')
    for (var field in subscriptions) {
      walk(subscriptions[field], field)
    }
    // resolve if subs

    function resolvergetter (hub, field) {
      console.log('RESOLVE =================================> ?', hub._scope, field)
      if(field === '$') {
        return hub
      }

      // all wrong
      return hub
    }

    // get client by id!
    function walk (subscription, field) {
      var target = field === '$' ? hub : hub.get(field, {})
      console.log('SCOPE:', hub._scope, target.lookUp('_scope') || target._scope)
      // target
      for (var subs in subscription) {
        for (var type in subscription[subs]) {

          if (subs === '$') {
            subs = true
          }
          hub = resolvergetter(target, subs)

          if (type === 'property') {
            var client = hub.clients[id]

            target.subscribe(subs, type, [ function (data, event, client) {
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
            console.log('got subs!@!@#!@#@#!!@#!@#!@#', hub.clients[id].val, target.lookUp('_scope'), hub._scope)

            target.subscribe(subs, type, [ function (data, event, client) {
              console.log('???', type, this.lookUp('_scope'))
              // if (client.parent.parent._scope === this.lookUp('_scope') || event === ev) {
              console.log('send from subs bitch:::::::::::========>', client.path, client.parent.parent._scope)
              client.send(this, hub, data, event)
              // }
            }, hub.clients[id] ], id, true, ev)
          }
        }
      }
    }
    ev.trigger()
  }
}
