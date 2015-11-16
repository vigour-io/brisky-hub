'use strict'
var Observable = require('vigour-js/lib/observable')
var Clients = new Observable({
  ChildConstructor: require('./client')
}).Constructor

exports.properties = {
  clients: function (data, event) {
    if (!this.hasOwnProperty('clients')) {
      this.clients = new Clients(data)
    }
  }
}