'use strict'
var Observable = require('vigour-js/lib/observable')
var Clients = new Observable({
  ChildConstructor: require('./client'),
  noContext: true
}).Constructor

exports.properties = {
  clients (data, event) {
    if (!this.hasOwnProperty('clients')) {
      this.clients = new Clients(data, event, this, 'clients')
    } else {
      this.clients.set(data, event)
    }
  }
}
