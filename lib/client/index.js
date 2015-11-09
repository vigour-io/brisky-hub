'use strict'
// var Observable = require('vigour-js/lib/observable')
var Observable = require('../observable') // rename this... its a hub-object
var _remove = Observable.prototype.remove
var uuid = require('vigour-js/lib/util/uuid').val
module.exports = new Observable({
  properties: {
    connection: true,
    scope: true
  },
  inject: require('./parse'),
  define: {
    remove (event, nocontext, noparent) {
      // need to remove all refs to client!!!
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
        this.connection && this._input &&
        data !== void 0
      ) {
        let stamp = event.stamp
        if (typeof stamp !== 'string') {
          stamp = uuid + '-' + stamp
        }
        // parse needs to become better
        // add reference support
        let output = this.parse(observable, hub, data, event)
        if (output !== void 0) {
          observable.emit('send', [data, this, toUpstream, output, hub], event)
          this.connection.send(JSON.stringify({
            set: output,
            stamp: stamp
          }))
        }
      }
    }
  }
}).Constructor
