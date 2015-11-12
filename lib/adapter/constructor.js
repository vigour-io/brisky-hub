'use strict'
var Observable = require('vigour-js/lib/observable')
module.exports = new Observable({
  properties: {
    id: require('vigour-js/lib/util/uuid') // default gets .val
  },
  inject: [
    require('./recieve')
  ]
}).Constructor
