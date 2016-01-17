'use strict'
// move to adapter much better
var Event = require('vigour-js/lib/event')
var Base = require('vigour-js/lib/base')

var merge = require('lodash/object/merge')
// var Hub = require('../')
var setWithPath = require('vigour-js/lib/util/setwithpath')

exports.define = {
  receiveSubscription (subscriptions, id, event) {
    var hub = this
    var client = hub.clients[id]
    // more batching here!
    var ev = new Event('subscription')
    // 1. SCOPES/NORMAL NO DIFFERENCE
    // 2. MAKE A 'HUBSUBSCRIPTIONS THING' -- do $ -- when , true it does not add listeners only sends up
    // 3. use attach on clients -- empty remove the subs -- this is a special thing for the attach field it uses
    // 4. just add a listener on remove on the client -- make sure it fires there where some false fields
    // 5. run function -- a walker that walks your map from a certain point collects the data and sends it
    // console.log('incoming subscription', JSON.stringify(subscriptions, false, 2))
    var response = {}
    for (var i in subscriptions) {
      for (var j in subscriptions[i]) {
        let path = j.split('.')
        handleSubs(
          j === '$' ? hub : hub.get(path, {}), subscriptions[i][j],
          void 0,
          client,
          setWithPath(response, path, {}),
          ev,
          response
        )
      }
    }
    // console.log(JSON.stringify(response, false, 2))
    // send back -- check if you have it yourself (same system loaded)
    client.connection.origin.send({
      stamp: ev.stamp,
      set: response
    })
    ev.trigger()
  }
}

function handleSubs (obs, map, key, client, returnobj, event, top) {
  if (key) {
    if (obs._input instanceof Base) {
      returnobj[key] = obs._input.syncPath.concat()
      returnobj[key].unshift('$')
      var o = {}
      setWithPath(o, obs._input.syncPath, {})
      merge(top, o)
      returnobj = top
      for (var n in obs._input.syncPath) {
        returnobj = returnobj[obs._input.syncPath[n]]
      }
      handleSubs(obs._input, map, void 0, client, returnobj, event, top)
      return
    } else {
      returnobj = returnobj[key] = {}
    }
  }
  for (var field in map) {
    if (field === 'parent') {
      console.log('ok ok parent bit exciting')
      handleSubs(obs._parent, map[field], void 0, client, returnobj, event, top)
    } else if (field === 'val') {
      returnobj.val = obs._input
    } else if (field === '*') {
      obs.origin.each(function (p, key) {
        handleSubs(p, map[field], key, client, returnobj, event, top)
      })
    } else {
      var t = obs.get(field, {})
      handleSubs(t, map[field], field, client, returnobj, event, top)
    }
  }
}
