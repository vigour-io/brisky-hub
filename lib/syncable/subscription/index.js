'use strict'
var hash = require('vigour-js/lib/util/hash')
var merge = require('lodash/object/merge')
var Event = require('vigour-js/lib/event')
var isEmpty = require('vigour-js/lib/util/is/empty')

exports.inject = require('./receive')

exports.define = {
  $ (map, event, ready, attach, key) {
    // ------------------------------------------------------------
    var trigger
    var adapter = this.getAdapter()
    var hub = adapter.parent

    if (!adapter || !adapter.websocket) {
      console.log('cant subscribe no websocket protocol (*temp only supports websocket)')
      // more guards are nessecary
      return
    }

    // HAS TO BECOME FOR EACH
    // ALSO HANDLE MULTIPLE SCOPES HERE
    var client = adapter.websocket.client && adapter.websocket.client.origin

    if (!key) {
      if (!map) {
        return
      }
      key = hash(JSON.stringify(map))
    }

    if (!event) {
      event = new Event('subscription')
      trigger = true
    }

    if (!client) {
      // can create strangeness of course -- need to mitigate perf impact when not having upstream
      if (hub.scope) {
        var t = Object.getPrototypeOf(hub)
        t.set({
          clients: { [adapter.id]: adapter.id }
        })
        client = t.clients[adapter.id]
      } else {
        hub.set({ clients: { [adapter.id]: adapter.id } })
        client = hub.clients[adapter.id]
      }
      hub.adapter.websocket.set({ client: client })
    }
    // ------------------------------------------------------------
    // TODO: refactor this
    if (ready) {
      ready.call(attach, this, hub, map, event, attach, key)
    }
    // ------------------------------------------------------------

    if (!client.hasOwnProperty('subscriptions')) {
      client.subscriptions = {}
    }
    var path = this.syncPath.join('.') || '$'
    var currentSubs = client.subscriptions[path] && client.subscriptions[path][key]
    console.log(client.subscriptions, map, currentSubs, key, path)
    if (currentSubs) {
      if (map === null) {
        console.log('lets remove!', key, currentSubs)
        console.log(currentSubs.$listeners)
        if (currentSubs.$listeners == 1 || !currentSubs.$listeners) {
          delete client.subscriptions[path][key]
          if (isEmpty(client.subscriptions[path])) {
            delete client.subscriptions[path]
          }
          // console.log('this means unsubscibe it!, the attach is super importante here')
          client.send(this, hub, { [path]: { [key]: null } }, event, ready || true)
        } else {
          currentSubs.$listeners--
        }
      } else if(!attach.__temp__ || attach.__temp__ !== currentSubs) {
        // use attach uid
        currentSubs.$listeners++
        // attach.__temp__ = currentSubs
        addRemoveListener.call(this, map, event, ready, attach, key)
        console.log('allready have subs handle special need to check attach', path, key, map)
      }
      // this is for multi upstream , also for multiple times same subscription with seperate bindings on the same page
    } else if (map !== null) {
      let subs = {
        [path]: {
          [key]: {
            $map: map,
            $listeners: 1
          }
        }
      }
      // if (this._subsstamps && this._subsstamps[key]) {
      //   subs[path].stamp = this._subsstamps[key] // scopes (shares allways over scopes)
      //   // this is important also for hte multie case
      // }
      merge(client.subscriptions, subs)
      // attach.__temp__ = subs
      client.send(this, hub, subs, event, ready || true)
      // console.warn('subs out --> ', key, ':', JSON.stringify(map, false, 2), this.path)
      addRemoveListener.call(this, map, event, ready, attach, key)
    }

    if (trigger) {
      event.trigger()
    }
  }
}

// ** FIRST THING! add remove listeners to godamnn elements so we dont need hackery!
function addRemoveListener (map, event, ready, attach, key) {
  if (attach) {
    attach.on('data', (data, event) => {
      if (data === null || this._input === null) {
        console.log('REMOVE!', key)
        this.$(null, event, void 0, attach, key)
      }
    })
  }
}

exports.properties = {
  _subsstamps: true,
  __temp__: true
}
// var