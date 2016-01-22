'use strict'
module.exports = function (data, event) {
  console.log(data.hash)
  var subshashes = data.hash
  // this is getting close to what to do
  if (subshashes) {
    // needs to become for each protocol!!!
    var client = this.adapter.websocket.client.origin
    if (client._subscallbacks) {
      for (var i in data.hash) {
        console.log('????!!!!', i)
        if (client._subscallbacks[i]) {
          console.log('yoyoyoyoyo')
          for (var j in client._subscallbacks[i]) {
            client._subscallbacks[i][j]()
          }
        }
      }
    }
  }
}
