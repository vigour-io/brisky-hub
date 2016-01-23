'use strict'
var setWithPath = require('vigour-js/lib/util/setwithpath')

module.exports = function collection (key, hub, map, event, result, client, top, path) {
  var obs = this
  hub.subscribe(path, 'property', [ function (data, event, client, path) {
    var payloadTop = {}
    var payload = {}
    if (data) {
      if (data.added) {
        for (let i in data.added) {
          let field = data.added[i]
          this[field].subscriptionWalker(field, hub, map, event, payload, client, payloadTop, path)
        }
      }
      if (data.removed) {
        for (let i in data.removed) {
          payload[data.removed[i]] = null
        }
      }
    }
    setWithPath(payloadTop, path, payload)
    if (this.scope === client.scope) {
      // empty checks
      client.connection.origin.send({
        stamp: event.stamp,
        set: payloadTop
      })
    }
  }, client ], client.val)

  if (obs) {
    obs.each(function (p, field) {
      p.subscriptionWalker(field, hub, map, event, result, client, top, path)
    })
  }
}

// remove subs - of course this must be handled better...
// reusing more stuff again -- use the same maps easy
