'use strict'
var seperator = require('../util').seperator

module.exports = {
  type: 'observable',
  properties: {
    origintest: true,
    id (id) {
      let inlined = new RegExp('^' + id + '\\' + seperator)
      this.isOrigin = function (val) {
        return inlined.test(val)
      }
      this.id = id
      return id
    }
  },
  id: require('vigour-util/uuid').val,
  on: {
    error (err) {
      console.log('adapter error:', err.message)
    }
  },
  inject: [
    require('./receive'),
    require('./scope')
  ]
}
