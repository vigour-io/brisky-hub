'use strict'
var setWithPath = require('vigour-js/lib/util/setwithpath')

module.exports = function collection (key, hub, map, event, result, client, top) {
  var path = this.syncPath
  hub.subscribe(path, 'property', [ function (data, event, client) {
    var payloadTop = {}
    var payload = {}
    if (data) {
      if (data.added) {
        for (let i in data.added) {
          let field = data.added[i]
          this[field].subscriptionWalker(field, hub, map[key], event, payload, client, payloadTop)
        }
      }
      if (data.removed) {
        for (let i in data.removed) {
          payload[data.removed[i]] = null
        }
      }
    }
    setWithPath(payloadTop, this.path, payload)
    if (this.scope === client.scope) {
      client.connection.origin.send({
        stamp: event.stamp,
        set: payloadTop
      })
    }
  }, client ], client.val)

  this.each(function (p, field) {
    p.subscriptionWalker(field, hub, map[key], event, result, client, top)
  })
}

// remove subs - of course this must be handled better...
// reusing more stuff again -- use the same maps easy
