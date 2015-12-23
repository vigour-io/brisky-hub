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
        console.log('yo set scopes!!!!!', data)

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
            if (property.client.origin.subscriptions) {
              set.client.subscriptions = property.client.origin.subscriptions
            }
            this.parent.parent.clients.each((property, key) => {
              // this cant be communcated up! must listen make event .noup or something
              if (key !== this.parent.id) {
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
    console.log('yo subsxxxx!')

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
        var subs = data.client.subscriptions
        data.client = client.serialize()
        data.client.subscriptions = subs
        console.log(client.listensOnAttach)
        // if (client.listensOnAttach) {
        //
        // }
        // console.log('yo subs!', data, client.subscriptions)

        // console.clear()
        // console.log('remove trough scope'.yellow.bold.inverse, event.stamp, event.removed)
        // connection has to be ignored when removing client else its wrong when firing
        // var ev = new Event(client, 'data', event.stamp + '$scoperemoval')
        // preferebly sharing event
        // ev.client = event.client
        // ev.isTriggered = true
        // client.markedformurder = true
        client.remove(event)
        // ev.trigger()
      }
    }
    return data
  }
}
