'use strict'
var Base = require('vigour-js/lib/base')
var reference = require('./reference')
var single = require('./single')
var collection = require('./collection')

exports.define = {
  subscriptionWalker: function subscriptionWalker (key, hub, map, event, result, client, top) {
    // check for reference! select obs and set correct result
    if (key) {
      if (this._input instanceof Base) {
        console.log('reference')
        reference.call(this, key, hub, map, event, result, client, top)
        return
      } else {
        // double check!
        result = result[key] = {}
      }
    }

    for (let key in map) {
      if (key === '*') {
        collection.call(this, key, hub, map[key], event, result, client, top)
      } else if (key === 'val') {
        single.call(this, key, hub, map[key], event, result, client, top)
      } else {
        // this can be out of scope maybe for now just put it all in scope?
        this.get(key, {})
          .subscriptionWalker(key, hub, map[key], event, result, client, top)
      }
    }
  }
}
