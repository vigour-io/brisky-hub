'use strict'
// move to adapter much better
var Event = require('vigour-js/lib/event')
var Base = require('vigour-js/lib/base')

var merge = require('lodash/object/merge')
// var Hub = require('../')
var setWithPath = require('vigour-js/lib/util/setwithpath')

exports.define = {
  receiveSubscription (subscriptions, id, event) {

    // console.log(subscriptions)

    var hub = this
    // if (this._scope) {
    //   console.log('----------------------------------------------------->', this._scope)
    // }
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
    var hashes = {} // last stamp
    // this will be stored of course over all subs

    for (var i in subscriptions) {
      // if(i === '')
      // console.log(i)
      if (typeof i !== 'string' || i.length > 7 || i.indexOf('.') > -1) {
        return
      }
      for (var j in subscriptions[i]) {
        // console.log(j, subscriptions[i][j])
        let path = j.split('.')
        // also have thing here
        let s =  path[0] === '$' ? response :  setWithPath(response, path, {})
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
      hashes[i] = true // replace with last stamp!
    }
    client.connection.origin.send({
      stamp: hub.adapter.id + '|' + ev.stamp, // + id
      set: response,
      hash: hashes
    })
    ev.trigger()
  }
}

// on initial -- send info back to client
function handleSubs (obs, map, key, client, returnobj, event, top, scope, hub) {
  if(!obs) {
    return
  }
  if (key) {
    if (obs && obs._input instanceof Base) {
      if (obs.lookUp('_scope') !== scope) {
        // console.error('WTF WTF', hub._scope, obs._path)
        obs = hub.get(obs.path, {})
      }
      // add ref listener!
      hub.subscribe(obs.path, [sendtoclient, client])
      // console.log('add ref listener!')
      returnobj[key] = obs._input.syncPath.concat()
      returnobj[key].unshift('$')
      var o = {}
      // if(!obs)
      // console.log('\n ----->',o, obs, obs._input && obs._input.syncPath, top)
      setWithPath(o, obs._input.syncPath, {})
      merge(top, o)
      returnobj = top
      for (var n in obs._input.syncPath) {
        returnobj = returnobj[obs._input.syncPath[n]]
      }
      // have to remove previous ones nested do it in handle...
      var xxx = obs._input
      obs.on('reference', [ function (data, ev, client) {
        if ((this._input && this._input !== xxx && ev.stamp !== event.stamp) && (this.lookUp('_scope') === client.lookUp('_scope'))) {
          xxx = this._input
          var x = {}
          var t = {}
          handleSubs(this._input, map, void 0, client, t, ev, x, scope, hub)
          // sendtoclient (data, event, client, payload) {
          // sendtoclient.call(this, data, event, client, t)
          if (this._input) {
            setWithPath(x, this._input.syncPath, t)
            var y = {}
            setWithPath(y, this.syncPath, this._input.syncPath.concat([])).unshift('$')
            merge(x, y)
            // console.log('\n', JSON.stringify(x, false, 2))
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
      // console.log('wtf wtf wtf')
      handleSubs(hub, map[field], void 0, client, returnobj, event, top, scope, hub)
    } else if (field === 'parent') {
      handleSubs(obs._parent, map[field], void 0, client, returnobj, event, top, scope, hub)
    } else if (field === 'val') {
      hub.subscribe(obs.path, [sendtoclient, client])
      returnobj.val = obs._input
    } else if (field === '*') {
      // console.log('yo yo yo')
      let lorigin = obs.origin
      hub.subscribe(obs.path, 'property', [ function (data, event, client) {
        var payload = {}
        var origin = this.origin
        // if (origin !== lorigin) {
        //   // remove all!
        //   obs.origin.each(function (p, key) {
        //     if (key) {
        //       payload[key] = null
        //     }
        //   })
        // }
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
        setWithPath(payloadTop, lorigin.path, payload)
        if (this.lookUp('_scope') === client.lookUp('_scope')) {
          client.connection.origin.send({
            stamp: event.stamp,
            set: payloadTop
            // hash: hashes
          })
        }
        // sendtoclient.call(this, data, event, client, payloadTop)
      }, client], client.val)
      // get your listener on
      // console.log('yoxxxxx yo yo', obs.path, obs._input, returnobj, obs.keys())

      obs.origin.each(function (p, key) {
        // console.log('----->', key)
        handleSubs(p, map[field], key, client, returnobj, event, top, scope, hub)
      })
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
  if (this.lookUp('_scope') === client.lookUp('_scope')) {
    // console.log('-------->', payload)
    client.send(this, hub, payload || this._input, event)
  }
}

// // temp fix this should work in the subscription prob
// function reflistener (data, event, client) {
//   var hub = client._parent._parent
//   // overwrites ofcourse need to verify -- does not work now for shizzle!
//   if (this.lookUp('_scope') === client.lookUp('_scope')) {
//     client.send(this, hub, this._input, event)
//   }
// }
