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
