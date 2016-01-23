'use strict'
var setWithPath = require('vigour-js/lib/util/setwithpath')

module.exports = function collection (key, hub, map, event, result, client, top, path, hash) {
  var obs = this
  var id = 'property' + client.val + hash

  if (obs) {
    obs.each(function (p, field) {
      p.subscriptionWalker(field, hub, map, event, result, client, top, path, hash)
    })
  }

  if (top === null) {
    hub.unsubscribe(path, id, true)
    return
  }

  hub.subscribe(path, 'property', [ function (data, event, client, path) {
    var payloadTop = {}
    var payload = {}
    if (data) {
      if (data.added) {
        for (let i in data.added) {
          let field = data.added[i]
          this[field].subscriptionWalker(field, hub, map, event, payload, client, payloadTop, path, hash)
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
  }, client ], id)
}

// remove subs - of course this must be handled better...
// reusing more stuff again -- use the same maps easy
// REMOVAL AS WELL!!!! // so rewalk and removing all attach :/ -- or just look at the client what the last id was
// first unsusbcirbe on single
