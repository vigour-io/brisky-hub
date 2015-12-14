'use strict'
var Event = require('vigour-js/lib/event')
exports.define = {
  receive (data, connection) {
    if (!data) {
      this.emit('error', 'no data to parse')
      return
    }
    if (!connection) {
      this.emit('error', 'no connection')
      return
    }
    let stamp = data.stamp
    console.log('in'.magenta, JSON.stringify(data, false, 2), this._path)
    if (
      typeof stamp === 'string' &&
      data.stamp.indexOf(this.id) === 0 &&
      data.stamp.indexOf('|') === this.id.length - 1
    ) {
      this.emit('error', 'recieved own event ' + stamp)
      return
    }

    let hub = this._parent
    let event = new Event(hub, 'data', stamp)
    let scope = data.scope
    let id
    event.isTriggered = true
    if (connection === 'upstream') {
      event.upstream = true
    } else {
      // just add an extra thing that specifies that your chaning a scope probably best
      if (data.client) {
        id = data.client.val
        event.stamp = id + '|' + stamp
        data = this.swtichScope(data, event)
        if (!id) {
          event.remove()
          this.emit('error', 'client without id tries to connect')
          return
        }
        data.client.connection = connection
        if (scope) {
          hub = hub.getScope(scope)
        }
        hub.set({ clients: { [id]: data.client } }, event)
        if (connection.ip) {
          hub.clients[id].set({ ip: connection.ip })
        }
      } else if (connection) {
        if (scope) {
          hub = hub.getScope(scope, event)
        }
      } else {
        event.remove()
        this.emit('error', 'connection without client')
        return
      }
    }

    if (data.subscribe) {
      // connection
      // console.error('xxxx', connection)
      if(connection !== 'upstream') {

        // console.log(connection, event)

        var client = hub.get(['clients' , event.stamp.split('|')[0] ], {})
        // console.log(client)
        hub.subscribe(data.subscribe, [require('../../lib/syncable/on/subscription'), client ])
      }
    }

    if (data.set) {
      hub.set(data.set, event)
    }
    event.trigger()
  }
}
