'use strict'
var merge = require('lodash/object/merge')
var Base = require('vigour-js/lib/base')
var collection = require('./collection')
var single = require('./single')

exports.define = {
  receiveSubscriptions (observable, hub, map, event, attach, key) {
    // this, hub, map, event, attach, key
    console.log('ok this client is the lucky one!', this.val, key, map)
    // console.log()
    var result = {}
    walker(observable, false, hub, map, event, result, this)
    console.log('lets send!', result)
    // if (observable._subsstamps) {
    //   this._subsstamps
    // }
  }
}

function walker (observable, keyx, hub, map, event, result, client) {
  // check for reference! select obs and set correct result
  if (observable._input instanceof Base) {
    console.log('references!')
    observable = reference(observable, keyx, hub, map, event, result, client)
  } else {
    result = keyx ? result[keyx] = {} : result
  }

  for (var key in map) {
    console.log('--->', key)
    if (key === '*') {
      collection(observable, key, hub, map[key], event, result, client)
    } else if (key === 'val') {
      single(observable, key, hub, map[key], event, result, client)
    } else {
      walker(observable.get(key, {}), key, hub, map[key], event, result, client)
    }
  }
}

function reference (observable, key, hub, map, event, result, client) {

}

// hangt allemaal scope listeners op original thats why scope is weird -- does share emitters like this
// get does not allways make a new thing
