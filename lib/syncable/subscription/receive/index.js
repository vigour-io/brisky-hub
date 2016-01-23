'use strict'
var Base = require('vigour-js/lib/base')
var reference = require('./reference')
var single = require('./single')
var collection = require('./collection')
var isEmpty = require('vigour-js/lib/util/is/empty')

exports.define = {
  subscriptionWalker: function subscriptionWalker (key, hub, map, event, result, client, top, path) {
    var obs = this
    var parentResult = result
    if (key) {
      path = obs ? obs.syncPath : path.concat(key)
      if (obs && obs._input instanceof Base) {
        reference.call(obs, key, hub, map, event, result, client, top)
        return
      } else {
        result = result[key] = {}
      }
    }

    for (let key in map) {
      if (key === '*') {
        collection.call(obs, key, hub, map[key], event, result, client, top, path)
      } else if (key === 'val') {
        single.call(obs, key, hub, map[key], event, result, client, top, path)
      } else {
        subscriptionWalker.call(obs && obs[key], key, hub, map[key], event, result, client, top, path)
      }
    }
    if (isEmpty(result)) {
      delete parentResult[key]
    }
  }
}
