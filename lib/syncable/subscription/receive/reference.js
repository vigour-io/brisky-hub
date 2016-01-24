'use strict'
var merge = require('lodash/object/merge')
var setWithPath = require('vigour-js/lib/util/setwithpath')
var Base = require('vigour-js/lib/base')
var REFARR = [ '$' ]
/*
  1. system for cleaning -- maybe just rewalk and go trough all tings.. prob best to do ugh
  2. send data does not work now!
  3. anonymous user /w reference subscriptions (and changing handle more stuff client side :X)
*/
module.exports = function reference (key, hub, map, event, result, client, top, hash) {
  // if this changes we need to clear all nested lesteners think of a fast, reliable good way to do that
  // maybe just rewalk for now?
  var obs = this

  console.log(key, map)
  if (obs.scope !== hub.scope) {
    console.log('unqual scopes lets see if its the same')
    // obs = hub.get(obs.path, {})
    // if (!obs._input) {
    return
    // }
  }

  let val = obs._input
  let path = val.syncPath

  if (result) {
    let tempResult = {}
    result[key] = REFARR.concat(path)
    setWithPath(tempResult, path, {})
    merge(top, tempResult)
    result = top
    for (var n in path) {
      result = result[path[n]]
    }
  }

  let id = 'reference' + client.val + hash
  // can just merge this subscription feels a bit too much
  val = val.subscriptionWalker(false, hub, map, event, result, client, top, path, hash)

  if (result === null) {
    // NEXT PROBLEM
    // hub.unsubscribe(obs.syncPath, id, true)
    return
  }

  // console.logx/('do it---->', map)

  hub.subscribe(obs.syncPath, 'reference', [ function (data, ev) {
    if (!(this._input instanceof Base)) {
      console.log('ref no longer a base , have to start cleaning up and changing up')
      return
    }

    if (data instanceof Base) {
      console.log('\n\n 🎈🎈🎈   ref is changing 🎈🎈🎈 ')
      console.log('  ', data.path.join('.'))
      console.log('\n')
      console.log('first one work....')
      // data.subscriptionWalker(false, hub, map, ev, null, client, null, path, hash)
    }

    if (
      (
        this._input &&
        client &&
        this._input !== val &&
        ev.stamp !== event.stamp
      ) &&
      this.scope === client.scope
    ) {
      console.log('lets fire and send some stuff NOW')
      let val = this._input
      let payload = {}
      let result = {}
      let path = val.syncPath
      console.log('so here???? lets do some stuff perhaps?', map, path, obs.syncPath)
      // why is hti smap only true? thats suer weird
      val = val.subscriptionWalker(false, hub, map, ev, result, client, payload, path, hash)
      setWithPath(payload, path, result)
      let reference = {}
      setWithPath(reference, this.syncPath, path.concat([])).unshift('$')
      merge(payload, reference)
      if (this.scope === client.scope || (hub.scope === client.scope && hub.get(this.syncPath) === this)) {
        console.log('yopayload!', JSON.stringify(payload, false, 2))
        client.connection.origin.push({
          stamp: hub.adapter.id + '|' + ~~(Math.random() * 9999), // do this normal! this sucks
          set: payload
        })
      }
    }
  }, client ], id)
}

  // LETS UNIFY THIS WITH THE OTHER SUBSCRIOTION
  // RLY IMPORTANT REMOVE ALL THESE LISTENERS WHEN STUFF CHANGES
  // SO WHEN REF IS NO LONGER REF REMOVE THIS LISTENER -- BUT ALSO REMOVE FORM THE OLD!
  // also anonymous users may be nice -- now refs are the only way :/ so special handle???
  // ALSO THIS IS POTENTIOLY FLAWED
   // LETS REOVE REFERENCE HERE AND MAKE ONE SINGLE AND ONE NORMAL LISTENER
   // THIS WILL LEAK MEM
  // all nested listeners that are attached here have to be handled special
  // REMOVE LISTENERS!
  // REMOVAL!!!!
