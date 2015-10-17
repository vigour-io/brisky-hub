'use strict'
exports.properties = {
  adapter: require('./constructor'),
  clients: require('./clients')// sepcial stuff for instances (only loop trough hasOwnProps for example)
}
