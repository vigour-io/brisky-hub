'use strict'
var Observable = require('vigour-observable')
var isEmpty = require('vigour/util/is/empty')
var Clients = new Observable({
  ChildConstructor: require('./client'),
  noContext: true,
  noInstance: true, //double check this one!
  on: {
    property: {
      scopeSwitch (data, event) {
        if (data && this._parent._scope && this._parent.autoRemoveScopes && data.removed) {
          if (isEmpty(this)) {
            delete this._parent._scopes[this._parent._scope]
            this._parent.remove(false)
            return
          }
        }
      }
    }
  },
  inject: [
    require('./syncable/on/syncpath')
  ]
}).Constructor

exports.properties = {
  autoRemoveScopes: true,
  clients (data, event) {
    if (!this.hasOwnProperty('clients')) {
      this.clients = new Clients(data, event, this, 'clients')
    } else {
      this.clients.set(data, event)
    }
  }
}

exports.inject = [
  require('./block')
]

// have to extend a property pretty annoying
exports.block = {
  clients: true
}
