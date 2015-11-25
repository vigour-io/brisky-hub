'use strict'
var Protocol = require('../protocol')

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
            property.client.origin.connection.origin.send(set, event)
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
        client.remove(event)
      }
    }
    return data
  }
}
