'use strict'
// scope needs to listen! different for up or down clients!!!
var Syncable = require('../syncable')
var Observable = require('vigour-js/lib/observable')
var _remove = Syncable.prototype.remove
var uuid = require('vigour-js/lib/util/uuid').val
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

      if (
        this.passScope(observable, hub, data, event, toUpstream) &&
        // this.connection &&
        this._input &&
        data !== void 0
      ) {
        let stamp = event.stamp
        if (typeof stamp !== 'string') {
          stamp = uuid + '-' + stamp
        }
        let output = this.parse(observable, hub, data, event)
        if (output !== void 0) {
          // observable.emit('send', [data, this, toUpstream, output, hub], event)
          this.connection.origin.send(JSON.stringify({
            set: output,
            stamp: stamp
          }))
        }
      }
    }
  }
}).Constructor
