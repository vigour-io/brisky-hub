'use strict'
module.exports = function single (key, hub, map, event, result, client, top, path, hash) {
  var obs = this
  var id = 'data' + client.val + hash

  if (result === null) {
    hub.unsubscribe(path[0] ? path : true, id, true)
    return
  }

  hub.subscribe(path[0] ? path : true, 'data', [
    function (data, event, client) {
      if (client.scope === hub.scope) {
        client.send(this, hub, this._input, event)
      }
    },
    client
  ], id)
  if (obs) {
    result.val = obs._input
  }
}

// put correct target needs subs hash as well
// hangt allemaal scope listeners op original thats why scope is weird -- does share emitters like this
// get does not allways make a new thing
// function sendtoclient (data, event, client, payload) {
//   var hub = client._parent._parent
//   // overwrites ofcourse need to verify -- does not work now for shizzle!
//   if (this.lookUp('_scope') === client.lookUp('_scope') || this.noContext) {
//     client.send(this, hub, payload || this._input, event)
//   }
// }
// start with single
