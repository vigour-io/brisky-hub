'use strict'
// move to adapter much better
var Event = require('vigour-js/lib/event')
var Base = require('vigour-js/lib/base')
var merge = require('lodash/object/merge')
var setWithPath = require('vigour-js/lib/util/setwithpath')

exports.define = {
  receiveSubscription (subscriptions, id, event) {
    // console.log('incoming subscriptions -------------------------- ' + id + '\n', JSON.stringify(subscriptions, false, 2), id)
    var hub = this
    var client = hub.clients[id]

    // dont do this its stupid!
    var ev = new Event('subscription')
    var response = {}
    var hashes = {}
    // need validation here

    for (var i in subscriptions) {
      // for each hash in subs
      // hash is path + subs
      // multiple subs? reconnect etc?

      for (var j in subscriptions[i]) {
        let path = j.split('.')
        let s = path[0] === '$' ? response : setWithPath(response, path, {})
        handleSubs(
          j === '$' ? hub : hub.get(path, {}),
          subscriptions[i][j],
          void 0,
          client,
          s,
          ev,
          response,
          hub._scope,
          hub
        )
      }
      // hashes.push(i)
      hashes[i] = true // replace with last stamp!
    }
    client.connection.origin.send({
      stamp: hub.adapter.id + '|' + ev.stamp, // + id
      set: response,
      hash: hashes // for callbacks
    })
    ev.trigger()
  }
}

// on initial -- send info back to client
function handleSubs (obs, map, key, client, returnobj, event, top, scope, hub) {
  if (key) {
    if (obs && obs._input instanceof Base) {
      // nocontext does not work yet...
      if (obs.lookUp('_scope') !== scope || obs.noContext) {
        // console.error('WTF WTF', hub._scope, obs._path)
        obs = hub.get(obs.path, {})
        if (!obs._input) {
          return
        }
      }
      hub.subscribe(obs.path, [sendtoclient, client])
      returnobj[key] = obs._input && obs._input.syncPath.concat()
      returnobj[key].unshift('$')
      var o = {}
      setWithPath(o, obs._input.syncPath, {})
      merge(top, o)
      returnobj = top
      for (var n in obs._input.syncPath) {
        returnobj = returnobj[obs._input.syncPath[n]]
      }
      var xxx = obs._input
      obs.on('reference', [ function (data, ev, client) {
        if ((this._input && this._input !== xxx && ev.stamp !== event.stamp) && (this.lookUp('_scope') === client.lookUp('_scope'))) {
          xxx = this._input
          var x = {}
          var t = {}
          handleSubs(this._input, map, void 0, client, t, ev, x, scope, hub)
          if (this._input) {
            setWithPath(x, this._input.syncPath, t)
            var y = {}
            setWithPath(y, this.syncPath, this._input.syncPath.concat([])).unshift('$')
            merge(x, y)
            if (this.lookUp('_scope') === client.lookUp('_scope')) {
              client.connection.origin.send({
                stamp: event.stamp,
                set: x
                // hash: hashes
              })
            }
          }
        }
      }, client], client.val)
      handleSubs(obs._input, map, void 0, client, returnobj, event, top, scope, hub)
      return
    } else {
      returnobj = returnobj[key] = {}
    }
  }
  for (var field in map) {
    if (field === '$') {
      handleSubs(hub, map[field], void 0, client, returnobj, event, top, scope, hub)
    } else if (field === 'parent') {
      handleSubs(obs._parent, map[field], void 0, client, returnobj, event, top, scope, hub)
    } else if (field === 'val') {
      hub.subscribe(obs.path, [sendtoclient, client])
      returnobj.val = obs._input
    } else if (field === '*') {
      let lorigin = obs.origin
      hub.subscribe(obs.path, 'property', [ function (data, event, client) {
        var payload = {}
        var origin = this.origin
        lorigin = origin
        let payloadTop = {}
        // remove subs - of course this must be handled better...
        if (data) {
          if (data.added) {
            for (let i in data.added) {
              payload[data.added[i]] = {}
              handleSubs(origin[data.added[i]], map[field], key, client, payload[data.added[i]], event, payloadTop, scope, hub)
            }
          }
          if (data.removed) {
            for (let i in data.removed) {
              payload[data.removed[i]] = null
            }
          }
        }
        if (origin) {
          setWithPath(payloadTop, lorigin.path, payload)
          if (this.lookUp('_scope') === client.lookUp('_scope') || this.noContext) {
            client.connection.origin.send({
              stamp: event.stamp,
              set: payloadTop
              // hash: hashes
            })
          }
        }
        // sendtoclient.call(this, data, event, client, payloadTop)
      }, client], client.val)
      // get your listener on
      if (obs.origin) {
        obs.origin.each(function (p, key) {
          handleSubs(p, map[field], key, client, returnobj, event, top, scope, hub)
        })
      }
    } else {
      var t = obs.get(field, {})
      handleSubs(t, map[field], field, client, returnobj, event, top, scope, hub)
    }
  }
}

// send (observable, hub, data, event, subscriptions) {
function sendtoclient (data, event, client, payload) {
  var hub = client._parent._parent
  // overwrites ofcourse need to verify -- does not work now for shizzle!
  if (this.lookUp('_scope') === client.lookUp('_scope') || this.noContext) {
    client.send(this, hub, payload || this._input, event)
  }
}
