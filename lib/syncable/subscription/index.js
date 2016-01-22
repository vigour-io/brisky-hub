'use strict'
var hash = require('vigour-js/lib/util/hash')
var merge = require('lodash/object/merge')
var Event = require('vigour-js/lib/event')

exports.define = {
  $ (map, event, ready, attach, key) {
    var trigger
    if (!event) {
      event = new Event('subscription')
      trigger = true
    }

    if (ready === null) {
      console.log('this means unsubscibe it!, the attach is super importante here')
      // maybe make emitter type for this? prob smart then just retrieve path?
    }

    if (!key) {
      key = hash(JSON.stringify(map))
    }

    var adapter = this.getAdapter()
    var hub = adapter.parent

    if (!adapter || !adapter.websocket) {
      // more guards are nessecary
      return
    }

    // HAS TO BECOME FOR EACH AND ADD SCOPES
    var client = adapter.websocket.client && adapter.websocket.client.origin

    if (!client) {
      // handle subscriptions when handled from a server, else just handle it immdiatly
      if (ready) {
        ready()
      }
      // ready()
      return
    }
    if (!client.hasOwnProperty('subscriptions')) {
      client.subscriptions = {}
    }
    var path = this.syncPath.join('.') || '$'
    var subs = {
      [path]: { [key]: map }
    }
    merge(client.subscriptions, subs)
    client.send(this, hub, subs, event, ready || true)
    console.log(key, ':', JSON.stringify(map, false, 2), this.path)

    if (trigger) {
      event.trigger()
    }
  }
}
