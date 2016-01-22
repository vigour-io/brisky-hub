'use strict'

module.exports = function single (key, hub, map, event, result, client) {
  var path = this.syncPath
  hub.subscribe(path.length > 1 ? path : true, [
    function (data, event, client) {
      client.send(this, hub, this._input, event)
    },
    client
  ])
  // handle ref
  // wrong!
  result.val = this._input
}

// hangt allemaal scope listeners op original thats why scope is weird -- does share emitters like this
// get does not allways make a new thing
// function sendtoclient (data, event, client, payload) {
//   var hub = client._parent._parent
//   // overwrites ofcourse need to verify -- does not work now for shizzle!
//   if (this.lookUp('_scope') === client.lookUp('_scope') || this.noContext) {
//     client.send(this, hub, payload || this._input, event)
//   }
// }
