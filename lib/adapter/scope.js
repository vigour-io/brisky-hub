'use strict'
var Protocol = require('../protocol')
// var Event = require('vigour-event')
exports.scope = {
  properties: { previous: true },
  $type: 'string',
  on: {
    data: {
      adapter (data, event) {
        var val = this.val
        this.parent.each(
          (property, key) => {
            let set = {
              previousScope: this.previous || true,
              stamp: event.stamp,
              client: { val: property.client.origin.key }
            }
            if (val) {
              set.scope = val
            }
            // var ev = new Event('data')
            // ev.upstream = true
            this.parent.parent.clients.each((property, key) => {
              // this cant be communcated up! must listen make event .noup or something
              if (key !== this.parent.id) {
                property.remove(false)
              }
            })
            // ev.trigger()
            property.client.origin.connection.origin.push(set, event)
          },
          (property) => property instanceof Protocol &&
            property.connected.val === true
        )
        this.previous = val
      }
    }
  }
}

exports.define = {
  swtichScope (data, event) {
    if (data.previousScope) {
      let id = data.client.val
      if (!id) {
        this.emit('error', 'trying to switch scope but no client id')
        return data
      }
      let hub = data.previousScope === true
        ? this._parent
        : this.get(['_parent', '_scopes', data.previousScope])
      if (!hub) {
        this.emit('error', 'cant find old scope (scope switch) ' + data.previousScope)
        return data
      }

      let client = hub.get(['clients', id])
      if (client) {
        var subs = data.client.subscriptions
        data.client = client.serialize()
        data.client.subscriptions = subs
        data.client.connection = client.connection && client.connection.origin
        // connection is wrong!
        // var ev = new Event()
        client.remove() // has to be done now!
        // ev.trigger()
      }
    }
    return data
  }
}
