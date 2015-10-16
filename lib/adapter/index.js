'use strict'
var Observable = require('../observable/')

exports.properties = {
  adapter: require('./constructor'),
  clients: new Observable({
    ChildConstructor: require('../client')
  })
  // sepcial stuff for instances (only loop trough hasOwnProps for example)
}
