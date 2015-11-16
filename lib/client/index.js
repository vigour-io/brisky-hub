'use strict'
// scope needs to listen! different for up or down clients!!!
var Syncable = require('../syncable')
var Observable = require('vigour-js/lib/observable')
var _remove = Syncable.prototype.remove
module.exports = new Syncable({
  properties: {
    connection: Observable
  },
  inject: require('./parse'),
  define: {
    remove (event, nocontext, noparent) {
      return _remove.call(this, event, nocontext, noparent)
    },
    passScope (observable, hub, data, event, toUpstream) {
      return (
        hub.scope === this.scope ||
        (
          toUpstream &&
          hub.clients[toUpstream] &&
          hub.clients[toUpstream].scope === hub.scope
        )
      )
    },
    send (observable, hub, data, event, toUpstream) {
      let id = hub.adapter.id //think about scopes!
      if (
        this.passScope(observable, hub, data, event, toUpstream) &&
        // this.connection &&
        this._input &&
        data !== void 0
      ) {
        let stamp = event.stamp
        if (typeof stamp !== 'string') {
          stamp = id + '-' + stamp
        }
        let output = this.parse(observable, hub, data, event)
        if (output !== void 0) {
          // console.log('client.send:', output, stamp, this.path)
          // observable.emit('send', [data, this, toUpstream, output, hub], event)
          this.connection.origin.send({
            set: output,
            stamp: stamp
          })
        }
      }
    }
  }
}).Constructor
