'use strict'
var Base = require('vigour-js/lib/base')

module.exports = function (load, event, client) {
  console.log('\n\n\nFIRE SUBSCRIPTION'.cyan.bold.inverse, ' --> client:', client.key.magenta.inverse)
  var adapter = this.getAdapter()
  if (!adapter) {
    return
  }
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
        let origin = load[i].origin
        if (data === void 0 && load[i].origin) {
          // console.log('ok normal? send empty object? or cancel', load[i].origin._path)
        } else if (data === null) {
          let parent = origin.parent
          while (parent && parent._input === null) {
            origin = parent
            parent = parent.parent
          }
        }
        client.send(origin, adapter.parent, data, event)
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
  if (!(obs._input && obs._input._input === null)) {
    client.send(obs, adapter.parent, obs._input, event)
  }
}
