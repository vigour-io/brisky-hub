'use strict'
// move to adapter much better
var Event = require('vigour-js/lib/event')
var setByPath = require('vigour-js/lib/util/setwithpath')
exports.define = {
  receiveSubscription (subscriptions, id, event) {
    var hub = this

    if (hub._scope) {
      console.log('xx====== SCOPE AND SUBS =====xxx')
    }

    var ev = new Event('data')
    for (var field in subscriptions) {
      walk(subscriptions[field], field)
    }
    // ** ULTRA UBER EXTREME DIRT **
    // put all listeners on the original SCHMART!
    // make a totally special subs for hubs -- gonna be easy fast and reliable -- use map make it bundles
    // speed it up make it better, clean it up tests -- make old tests pass!
    // double connections multu upstream, cleaning up subs all things need to be done
    function resolvergetter (hub, field) {
      if (field === '$') {
        return hub
      }
      // all wrong
      return Object.getPrototypeOf(hub) || hub
    }
    // get client by id!
    function walk (subscription, field) {
      var reshub = resolvergetter(hub, subs)
      var target = field === '$' ? reshub : reshub.get(field, {})
      for (var subs in subscription) {
        for (var type in subscription[subs]) {
          if (subs === '$') {
            subs = true
          }
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
            target.subscribe(subs, type, [ function (data, event, client) {
              if (client.parent.parent._scope === this.lookUp('_scope') || event === ev || !this.lookUp('_scope')) {
                if (!this.lookUp('_scope') && client.parent.parent._scope) {
                  // now do special trickas
                  var realdeal = hub.get(this.path)
                  // console.log('yo', realdeal.)
                  data = realdeal ? realdeal._input : this
                }
                client.send(realdeal || this, hub, data, event)
              }
            }, hub.clients[id] ], id, true, ev)
          }
        }
      }
    }
    ev.trigger()
  }
}
