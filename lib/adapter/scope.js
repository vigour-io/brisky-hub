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
            property.client.origin.connection.origin.send({
              scope: val,
              previousScope: this.previous,
              stamp: event.stamp,
              client: { val: property.client.origin.key }
            }, event)
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
        console.error('trying to switch scope but no id!')
        return data
      }
      let hub = this.get(['_parent', '_scopes', data.previousScope])
      if (!hub) {
        console.error('cant find dat old scope!')
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
