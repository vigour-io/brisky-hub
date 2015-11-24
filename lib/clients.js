'use strict'
var Observable = require('vigour-js/lib/observable')
var isEmpty = require('vigour-js/lib/util/is/empty')
var Clients = new Observable({
  ChildConstructor: require('./client'),
  noContext: true,
  on: {
    property: {
      removeScope (data) {
        if (data && this.parent._scope && this.parent.autoRemoveScopes && data.removed) {
          if (isEmpty(this)) {
            console.error('OK LETS REMOVE THIS! (if scope)', this._path)
          }
        }
      }
    }
  }
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
