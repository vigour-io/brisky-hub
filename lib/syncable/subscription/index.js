'use strict'
var hash = require('vigour-js/lib/util/hash')
var merge = require('lodash/object/merge')
var Event = require('vigour-js/lib/event')

exports.inject = require('./receive')

exports.define = {
  $ (map, event, ready, attach, key) {
    var trigger
    if (!event) {
      event = new Event('subscription')
      trigger = true
    }

    // can also extend listens on attach?
    // or do we need to make subscription observables that use attach sutff?
    // may be better
    // on('subs') //special emitter removes the whole emitter when no attac anymore
    // then subs observable

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
      console.log('cant subscribe no websocket (tmep only websocket)')
      // more guards are nessecary
      return
    }

    // HAS TO BECOME FOR EACH AND ADD SCOPES
    var client = adapter.websocket.client && adapter.websocket.client.origin

    if (!client) {
      // handle subscriptions when handled from a server, else just handle it immdiatly
      if (ready) {
        ready.call(attach, this, hub, map, event, attach, key)
      }
      // ready()
      return
    }
    if (!client.hasOwnProperty('subscriptions')) {
      client.subscriptions = {}
    }
    var path = this.syncPath.join('.') || '$'
    // $ means hub root

    if (client.subscriptions[path]) {
      console.log('allready have subs handle special need to check attach', path, key)
      // this is for multi upstream , also for multiple times same subscription with seperate bindings on the same page
    } else {
      let subs = {
        [path]: { [key]: map }
      }

      if (this._subsstamps && this._subsstamps[key]) {
        subs[path].stamp = this._subsstamps[key] // scopes (shares allways over scopes)
        // this is important also for hte multie case
      }

      merge(client.subscriptions, subs)
      client.send(this, hub, subs, event, ready || true)
      console.warn('subs out --> ', key, ':', JSON.stringify(map, false, 2), this.path)
    }

    if (trigger) {
      event.trigger()
    }
  }
}

exports.properties = {
  _subsstamps: true,
  _cachedresults: true
}
