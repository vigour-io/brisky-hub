'use strict'
var Observable = require('vigour-js/lib/observable')
module.exports = new Observable({
  properties: {
    id: require('vigour-js/lib/util/uuid') // default gets .val
  },
  inject: [
    require('./parse'),
    require('./scope'),
    require('./protocol') // just use id so you can choose one
  ],
  listens: false
}).Constructor
