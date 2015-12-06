'use strict'
var Protocol = require('../protocol')
var Event = require('vigour-js/lib/event')
exports.scope = {
  inject: require('vigour-js/lib/operator/type'),
  properties: {
    previous: true
  },
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
            this.parent.parent.clients.each((property, key) => {
              // this cant be communcated up!
              if (key !== this.parent.id) {
                // not false just not send it up
                // event.upstream = true
                console.log('xxxxx', event.stamp)
                // let event = new Event('scope')
                // event.stamp = 'xxx'
                // event.
                property.remove(false)
              }
            })
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
        this.emit('error', 'cant find old scope (scope switch)')
        return data
      }
      let client = hub.get(['clients', id])
      if (client) {
        data.client = client.serialize()
        console.log('remove trough scope', event, event.removed)
        var ev = new Event('data', client)
        // preferebly sharing event
        ev.stamp = ev.stamp + '$scoperemoval'
        ev.client = event.client
        ev.isTriggered = true
        client.remove(ev)
        ev.trigger()
      }
    }
    return data
  }
}
