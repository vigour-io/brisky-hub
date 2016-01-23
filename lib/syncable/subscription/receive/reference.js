'use strict'
var merge = require('lodash/object/merge')
var setWithPath = require('vigour-js/lib/util/setwithpath')
var Base = require('vigour-js/lib/base')

module.exports = function reference (key, hub, map, event, result, client, top) {
  var obs = this

  if (obs.scope !== hub.scope) {
    console.log('unqual scopes lets see if its the same')
    obs = hub.get(obs.path, {})
    if (!obs._input) {
      return
    }
  }

  let val = obs._input
  let path = val.syncPath
  let tempResult = {}

  result[key] = path.concat()
  result[key].unshift('$')
  setWithPath(tempResult, path, {})
  merge(top, tempResult)
  result = top
  for (var n in path) {
    result = result[path[n]]
  }

  obs.subscribe(path, 'reference', [ function (data, ev, client) {
    if (!(this._input instanceof Base)) {
      console.log('ref no longer a base , have to start cleaning up and changing up')
      return
    }
    if (
      (
        this._input &&
        this._input !== val &&
        ev.stamp !== event.stamp
      ) &&
      this.scope === client.scope
    ) {
      let val = this._input
      let payload = {}
      let result = {}
      let path = val.syncPath
      val.subscriptionWalker(false, hub, map, ev, result, client, payload, path)
      setWithPath(payload, path, result)
      let reference = {}
      setWithPath(reference, this.syncPath, path.concat([])).unshift('$')
      merge(payload, reference)
      if (this.lookUp('_scope') === client.lookUp('_scope')) {
        client.connection.origin.send({
          stamp: event.stamp,
          set: payload
        })
      }
    }
  }, client ], client.val)

  val.subscriptionWalker(false, hub, map, event, result, client, top, path)
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
