'use strict'
var Base = require('vigour-js/lib/base')
var reference = require('./reference')
var single = require('./single')
var collection = require('./collection')
var isEmpty = require('vigour-js/lib/util/is/empty')

exports.define = {
  subscriptionWalker: function subscriptionWalker (key, hub, map, event, result, client, top, path, hash) {
    console.log(key, hash, top)

    var obs = this
    var parentResult = result
    if (key) {
      path = obs ? obs.syncPath : path.concat(key)
      if (obs && obs._input instanceof Base) {
        reference.call(obs, key, hub, map, event, result, client, top, hash)
        return
      } else if (result) {
        result = result[key] = {}
      }
    }

    for (let key in map) {
      if (key === '*') {
        collection.call(obs, key, hub, map[key], event, result, client, top, path, hash)
      } else if (key === 'val') {
        single.call(obs, key, hub, map[key], event, result, client, top, path, hash)
      } else if (key === 'parent') {
        let parent = obs && obs.parent
        let spath = parent ? parent.syncPath : path.slice(0, -1)
        let presult = top
        if (top) {
          for (let segment in spath) {
            if (presult[spath[segment]]) {
              presult = presult[spath[segment]]
            } else {
              presult = presult[spath[segment]] = {}
            }
          }
        }
        subscriptionWalker.call(parent, void 0, hub, map[key], event, presult, client, top, spath, hash)
      } else {
        // handle parent a bit better
        subscriptionWalker.call(obs && obs[key], key, hub, map[key], event, result, client, top, path, hash)
      }
    }
    if (result && isEmpty(result)) {
      delete parentResult[key]
    }
  }
}
