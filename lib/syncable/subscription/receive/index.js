'use strict'
var Base = require('vigour-js/lib/base')
var reference = require('./reference')
var single = require('./single')
var collection = require('./collection')
var isEmpty = require('vigour-js/lib/util/is/empty')
var merge = require('lodash/object/merge')

exports.define = {
  subscriptionWalker: function subscriptionWalker (key, hub, map, event, result, client, top, path, hash) {
    var obs = this
    if (obs && obs._context && !obs.noContext) {
      obs = obs.resolveContext({}, event, obs._context) // moet nog met false
    }

    if (top === null) {
      // console.log('REMOVE REMOVE REMOVE')
    }

    var parentResult = result
    if (key) {
      path = obs ? obs.syncPath : path.concat(key)
      if (obs && obs._input instanceof Base) {
        //24
        reference.call(obs, key, hub, map, event, result, client, top, hash)
        return obs
      } else if (result) {
        if (result[key]) {
          result = result[key]
        } else {
          result = result[key] = {}
        }
      }
    }
    // this means we have to send the map as well when removing or we have to search
    // for the subs map stored somewhere prob smartes
    for (let key in map) {
      if (key === '*') {
        collection.call(obs, key, hub, map[key], event, result, client, top, path, hash)
      } else if (key === 'val') {
        single.call(obs, key, hub, map[key], event, result, client, top, path, hash)
      } else if (key === 'parent') {
        // let parent = obs && obs.parent
        // let spath = parent ? parent.syncPath : path.slice(0, -1)
        // let presult = top
        // if (top) {
        //   for (let segment in spath) {
        //     if (presult[spath[segment]]) {
        //       presult = presult[spath[segment]]
        //     } else {
        //       console.log(presult)
        //       presult = presult[spath[segment]] = {}
        //     }
        //   }
        // }
        // merge map as well...
        // fucking annoying turd stuff
        // DO THIS IN PURE MAP IF POSSIBLE! THIS IS DIRT
        // parent -- may not be provided!
        // need to go one up
        // merge(map, map[key])
        // this is wrong
        // has to go to PARENT map
        // delete map[key]
        // parent is fucked...
        // subscriptionWalker.call(parent, void 0, hub, map[key], event, presult, client, top, spath, hash)
      } else {
        // handle parent a bit better
        subscriptionWalker.call(obs && obs[key], key, hub, map[key], event, result, client, top, path, hash)
      }
    }
    if (result && isEmpty(result)) {
      delete parentResult[key]
    }
    return obs
  }
}
