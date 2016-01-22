'use strict'
var merge = require('lodash/object/merge')
var Base = require('vigour-js/lib/base')
var collection = require('./collection')
var reference = require('./reference')
var single = require('./single')
var setWithPath = require('vigour-js/lib/util/setWithPath')

exports.define = {
  receiveSubscriptions (observable, hub, map, event, attach, key) {
    // this, hub, map, event, attach, key
    console.log('ok this client is the lucky one!', this.val, key, map)
    // console.log()
    var result = {}
    var path = observable.syncPath
    var top = path.length < 1 ? result : setWithPath(result, path, {})
    walker(
      observable,
      false,
      hub,
      map,
      event,
      result,
      this,
      top
    )

    console.log('lets send!', result)

    // if (observable._subsstamps) {
    //   this._subsstamps
    // }
  }
}

// make walker a define property

function walker (observable, keyx, hub, map, event, result, client, top) {
  // check for reference! select obs and set correct result
  if (observable._input instanceof Base) {
    console.log('reference')
    observable = reference(observable, keyx, hub, map, event, result, client)
  } else {
    result = keyx ? result[keyx] = {} : result
  }

  for (var key in map) {
    console.log('--->', key)
    if (key === '*') {
      // collection needs to access walker again
      collection(observable, key, hub, map[key], event, result, client)
    } else if (key === 'val') {
      single(observable, key, hub, map[key], event, result, client)
    } else {
      walker(observable.get(key, {}), key, hub, map[key], event, result, client, top)
    }
  }
}



// hangt allemaal scope listeners op original thats why scope is weird -- does share emitters like this
// get does not allways make a new thing
