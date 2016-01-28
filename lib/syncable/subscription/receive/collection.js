'use strict'
var setWithPath = require('vigour-js/lib/util/setwithpath')

module.exports = function collection (key, hub, map, event, result, client, top, path, hash) {
  // console.log('collection ---->', path, result === null ? 'REMOVE' : 'SET')

  var obs = this
  var id = 'property' + client.val + hash
  if (obs) {
    if (result === null) {
      console.log('helllo!!!! remove coll')
    }
    obs.each(function (p, field) {
      if (result === null) {
        console.log('coll remove bitch!', field)
      }
      p = p.subscriptionWalker(field, hub, map, event, result, client, top, path, hash)
    })
  }

  if (top === null) {
    // console.log('unsubs collection!!!!!')
    hub.unsubscribe(path, id, true)
    return
  }

  hub.subscribe(path, 'property', [ function (data, event, client) {
    var payloadTop = {}
    var payload = {}

    // console.log('prop fires!', data, this.path)
    if (!data) {
      // **** REMOVE LISTENERS **** remove listeners!
      // console.log('PROP PROP PROP', data, this.path, this._input)
      this.each(function (p, field) {
        p = p.subscriptionWalker(field, hub, map, event, payload, client, payloadTop, path, hash)
      })
    } else if (data) {
      if (data.added) {
        for (let i in data.added) {
          let field = data.added[i]
          this[field].subscriptionWalker(field, hub, map, event, payload, client, payloadTop, path, hash)
        }
      }
      if (data.removed) {
        for (let i in data.removed) {
          // **** REMOVE LISTENERS **** remove listeners!
          payload[data.removed[i]] = null
        }
      }
    }
    // this.each(function (p, field) {
    //   p = p.subscriptionWalker(field, hub, map, event, result, client, top, path, hash)
    // })
    setWithPath(payloadTop, path, payload)
    // if (this.scope === client.scope) {
    // empty checks
    if (event && (typeof event.stamp !== 'string' || event.stamp.indexOf(client.val) !== 0)) {
      // just use send here!
      client.connection && client.connection.origin.send({
        stamp: event.stamp,
        set: payloadTop
      })
    }
    // }
  }, client ], id)
}

// remove subs - of course this must be handled better...
// reusing more stuff again -- use the same maps easy
// REMOVAL AS WELL!!!! // so rewalk and removing all attach :/ -- or just look at the client what the last id was
// first unsusbcirbe on single
