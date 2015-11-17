'use strict'
// reason this exists is to have a reliable place for protocols (no mix ups)
// this allows us to do way faster checks etc
var Observable = require('vigour-js/lib/observable')
module.exports = new Observable({
  properties: {
    id: require('vigour-js/lib/util/uuid')
  },
  inject: require('./receive')
}).Constructor
