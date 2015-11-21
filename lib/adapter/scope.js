'use strict'
var Protocol = require('../protocol')

exports.scope = {
  inject: require('vigour-js/lib/operator/type'),
  $type: 'string',
  on: {
    data: {
      adapter () {
        this.parent.each((property, key) => {
          // console.log('hey hey hey! ze fuck only want to know if it switches!'.rainbow, key)
        }, (property) => {
          // console.log(this.val, property.client && property.client._scope)
          return property instanceof Protocol &&
            property.connected.val === true
        })
      }
    }
  }
}
