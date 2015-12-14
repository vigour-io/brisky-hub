'use strict'

var Base = require('vigour-js/lib/base')

module.exports = function (load, event, client) {
  console.log('\n\n\nFIRE SUBS!'.blue.bold.inverse, client.key.magenta.inverse, this._path)
  if (!client.connection) {
    console.log('---> no client yet! it the stuff that needs fixing'.red.bold)
  }
  var adapter = this.getAdapter()
  if (!adapter) {
    return
  }

  var eventorigin = this.parseEvent(event, adapter)

  if (eventorigin && client.key !== eventorigin && client.connection &&
    client !== event.client &&
    (client.connection && client.connection.origin.upstream && !client.connection.origin.upstream._input)
  ) {
    for (var i in load) {
      console.log('--->'.magenta, load[i].origin._path.join('.'))
      let data = load[i].data
      if (load[i].origin._input instanceof Base) {
        // if (data === null) {
        //   console.log('!!!---->'.green.bold, data, load[i].origin._path)
        // }
        console.log('--->'.blue.bold, load[i].origin._input._path)
        recursive(load[i].origin, event, adapter, client, data)
      } else {
        console.log('------>'.white.bold.inverse, client.val)
        client.send(load[i].origin, adapter.parent, data, event)
      }
    }
  } else {
    console.log('blocked upstream or own event'.red.inverse)
  }
}

function recursive (obs, event, adapter, client, data) {
  if (obs._input instanceof Base) {
    recursive(obs._input, event, adapter, client, data)
  }
  if (!obs._input && data === null) {
    console.log('referenced was here is now removed we need the path!!!'.red)
    console.log(obs._input, obs._path && obs._path.join('.'))
  }
  client.send(obs, adapter.parent, obs._input, event)
}
