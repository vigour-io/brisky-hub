'use strict'
var Observable = require('../observable/')

exports.properties = {
  adapter: require('./constructor'),
  clients: new Observable()
  // sepcial stuff for instances (only loop trough hasOwnProps for example)
}
