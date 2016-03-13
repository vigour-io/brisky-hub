'use strict'
var hash = require('vigour-js/lib/util/hash')
var merge = require('lodash/object/merge')
var Event = require('vigour-js/lib/event')
var Protocol = require('../../protocol')
var isEmpty = require('vigour-js/lib/util/is/empty')
var glob = {
  uid: 'globalsub',
  path: [ 'global' ]
}
exports.inject = require('./receive')

exports.define = {
  $ (map, event, ready, attach, key) {
    // have to do something fast with the unsubscribe thing
    // the listeners dont allways work
    // thing its not rly removed or somethign and then it does not readd it
    // FIX FIX FIX

    if (!attach) {
      attach = glob
    }
    // ------------------------------------------------------------
    var trigger
    var adapter = this.getAdapter()
    if (!adapter) {
      return
    }

    if (!event) {
      event = new Event('subscription')
      trigger = true
    }

    adapter.each((p) => {
      subscribeProtocol.call(this, adapter, p, map, event, ready, attach, key)
    }, (p) => p instanceof Protocol)

    if (trigger) {
      event.trigger()
    }
  }
}

// ** FIRST THING! add remove listeners to godamnn elements so we dont need hackery!
function addRemoveListener (map, event, ready, attach, key) {
  if (attach && attach.on) {
    attach.on('data', (data, event) => {
      if (data === null || this._input === null) {
        // console.log('REMOVE!', key)
        this.$(null, event, void 0, attach, key)
      }
    })
  }
}

exports.properties = {
  _subsstamps: true
}

function subscribeProtocol (adapter, protocol, map, event, ready, attach, key) {
  var hub = adapter.parent
  // HAS TO BECOME FOR EACH
  // ALSO HANDLE MULTIPLE SCOPES HERE
  var client = protocol.client && protocol.client.origin
  if (!key) {
    if (!map) {
      return
    }
    key = hash(JSON.stringify(map))
  }

  if (!client) {
    // can create strangeness of course -- need to mitigate perf impact when not having upstream
    if (hub.scope) {
      var t = hub.originalHub
      t.set({
        clients: { [adapter.id]: adapter.id }
      })
      client = t.clients[adapter.id]
    } else {
      hub.set({ clients: { [adapter.id]: adapter.id } })
      client = hub.clients[adapter.id]
    }
    protocol.set({ client: client })
  }
  // ------------------------------------------------------------
  // TODO: refactor this
  if (ready) {
    ready.call(attach, this, hub, map, event, attach, key, protocol)
  }
  // ------------------------------------------------------------

  if (!client.hasOwnProperty('subscriptions')) {
    client.subscriptions = {}
  }
  var path = this.syncPath.join('.') || '$'
  var currentSubs = client.subscriptions[path] && client.subscriptions[path][key]
  if (currentSubs) {
    if (map === null) {
      if (currentSubs.$listeners) {
        delete currentSubs.$listeners[attach.uid]
      }
      if (!currentSubs.$listeners || isEmpty(currentSubs.$listeners)) {
        delete client.subscriptions[path][key]
        if (isEmpty(client.subscriptions[path])) {
          delete client.subscriptions[path]
        }
        client.send(this, hub, { [path]: { [key]: null } }, event, ready || true)
      }
    } else if (!currentSubs.$listeners[attach.uid]) {
      currentSubs.$listeners[attach.path.join('.')] = attach.path.join('.')
      addRemoveListener.call(this, map, event, ready, attach, key)
    }
    // this is for multi upstream , also for multiple times same subscription with seperate bindings on the same page
  } else if (map !== null) {
    let subs = {
      [path]: {
        [key]: {
          $map: map,
          $listeners: {
            [attach.uid]: attach.path && attach.path.join('.')
          }
        }
      }
    }
    merge(client.subscriptions, subs)
    client.send(this, hub, subs, event, ready || true)
    addRemoveListener.call(this, map, event, ready, attach, key)
  }
}