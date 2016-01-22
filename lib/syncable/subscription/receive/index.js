'use strict'
// var merge = require('lodash/object/merge')
var Base = require('vigour-js/lib/base')
var reference = require('./reference')
var single = require('./single')

exports.define = {
  subscriptionWalker: function subscriptionWalker (key, hub, map, event, result, client, top) {
    // check for reference! select obs and set correct result
    if (key) {
      if (this._input instanceof Base) {
        console.log('reference')
        reference.call(this, key, hub, map, event, result, client)
        return
      } else {
        // double check!
        result = result[key] = {}
      }
    }

    for (let key in map) {
      console.log('--->', key)
      if (key === '*') {
        // collection needs to access walker again
        // collection(observable, key, hub, map[key], event, result, client)
      } else if (key === 'val') {
        single.call(this, key, hub, map[key], event, result, client)
      } else {
        // this can be out of scope maybe for now just put it all in scope?
        this.get(key, {})
          .subscriptionWalker(key, hub, map[key], event, result, client, top)
      }
    }
  }
}
