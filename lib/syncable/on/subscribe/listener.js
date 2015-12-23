'use strict' 
var Base = require('vigour-js/lib/base')

module.exports = function (load, event, client) {
  console.log('\n\n\nFIRE why not??!'.blue.bold.inverse, client.key.magenta.inverse, this._path, load)
  // if (!client.connection) {
  //   console.log('---> no client yet!  the stuff that needs fixing (make subs part of clients)'.red.bold)
  // }
  var adapter = this.getAdapter()
  if (!adapter) {
    return
  }
  // console.log('letsgo')

  var eventorigin = this.parseEvent(event, adapter)

  if (eventorigin &&
    client.key !== eventorigin &&
    client.connection &&
    client !== event.client &&
      (client.connection && client.connection.origin.upstream && !client.connection.origin.upstream._input)
  ) {
    for (var i in load) {
      let data = load[i].data
      if (load[i].origin._input instanceof Base) {
        recursive(load[i].origin, event, adapter, client, data)
      } else {
        if (data === void 0 && load[i].origin) {
          // console.log('ok normal? send empty object? or cancel', load[i].origin._path)
        }
        client.send(load[i].origin, adapter.parent, data, event)
      }
    }
  } else {
    // console.log('blocked upstream or own event'.red.inverse)
    // console.log('load is:'.bold, load)
  }
}

function recursive (obs, event, adapter, client, data) {
  if (obs._input instanceof Base) {
    recursive(obs._input, event, adapter, client, data)
  }
  // if (!obs._input && data === null) {
  //   // console.log('referenced was here is now removed we need the path!!!'.red)
  //   // console.log(obs._input, obs._path && obs._path.join('.'))
  // }
  // // console.log('recusrce! send', obs, obs._input)
  // // have to send the referenced thing as well just to be sure!
  if (obs._input && obs._input._input === null) {
    // client.send(obs, adapter.parent, void 0, event)
  } else {
    client.send(obs, adapter.parent, obs._input, event)
  }
}
