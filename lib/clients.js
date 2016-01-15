'use strict'
var Observable = require('vigour-js/lib/observable')
var isEmpty = require('vigour-js/lib/util/is/empty')
var Clients = new Observable({
  ChildConstructor: require('./client'),
  noContext: true,
  on: {
    property: {
      handleAll (data, event) {
        // removeScope

        // every scope attaches a listener to the original
        // in the original we have clients etc etc

        if (data && this._parent._scope && this._parent.autoRemoveScopes && data.removed) {
          if (isEmpty(this)) {
            // maybe make this an event? removed all clients -- then the handle can be set on scope
            delete this._parent._scopes[this._parent._scope]
            this._parent.remove(false)
            return
          }
        }
         // send all data find stuff
        console.log('ok im going to send the client infos')
        if (this._input === null || !this._parent._scope) {
          return
        }
        var scope = this.parent._scope
        var clientsback = {}
        if (data && (data.added || data.removed)) {
          if (data.removed) {
            for (var i in data.removed) {
              clientsback[data.removed[i]] = null
            }
          }
          // use this better...
          // if (data.added) {
          //   for (var i in data.added) {
          //     clientsback[data.added[i]] = this[data.added[i]].serialize()
          //   }
          // }
        }
        // else {
        this.each((p, key) => {
          if (p._input === null) {
            return
          }
          clientsback[key] = p.serialize && p.serialize()
        })
        // }
        this.each((p, k) => {
          if (typeof stamp === 'string' && event.stamp.indexOf(k) === 0) {
            return
          }
          ;(p._input !== null && p.connection && p.connection._input !== null) && p.connection.origin.send({
            set: {
              clients: clientsback
            },
            stamp: event.stamp
          })
        })
      }
    }
  }
  // inject: [
  //   require('./syncable/on/subscribe'),
  //   require('./syncable/on/methods')
  // ]
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

exports.inject = [
  require('./block')
]

// have to extend a property pretty annoying
exports.block = {
  clients: true
}
