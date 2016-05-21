'use strict'
module.exports = function (client, state, stamp) {
  // needs to be extended of course!
  // can also send more at once of course will happen shortly
  // on close etc etc
  var obj = {}
  var path = state.realPath(false, true)
  var select = obj
  var len = len = path.length - 1
  for (let i = 0, len; i < len; i++) {
    select = select[path[i]] = {}
  }
  select[path[len]] = state.serialize()
  return client.connection.send(JSON.stringify({
    state: obj,
    stamp: stamp
  }))
}
