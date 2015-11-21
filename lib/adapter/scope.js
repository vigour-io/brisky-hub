'use strict'
var Protocol = require('../protocol')
exports.scope = {
  inject: require('vigour-js/lib/operator/type'),
  $type: 'string',
  on: {
    data: {
      adapter () {
        this.parent.each(
          (property, key) => {
            console.log('SCOPE SWITCHES'.rainbow, key)
          },
          (property) => property instanceof Protocol &&
            property.connected.val === true
        )
      }
    }
  }
}
