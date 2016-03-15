'use strict'
var seperator = require('../util').seperator
var Protocol = require('../protocol')

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
    },
    websocket: require('../protocol/websocket')
  },
  define: {
    keysCheck: (val, key) =>
      val[key] &&
      val[key] instanceof Protocol &&
      val[key].client &&
      val[key].val
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
