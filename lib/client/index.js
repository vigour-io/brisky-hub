'use strict'
// var Observable = require('vjs/lib/observable')

var Observable = require('../observable') // rename this... its a hub-object

var _remove = Observable.prototype.remove
var uuid = require('vjs/lib/util/uuid').val
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
    send (observable, hub, data, event, toUpstream) {
      // seperate method -- resolve scopes
      if (hub.scope || this.scope) {
        if (this.scope && hub.scope === this.scope) {
          console.log('yep', this._path)
        } else {
          if (toUpstream) {
            let clientorigin = hub.clients[toUpstream]
            if (clientorigin && clientorigin.scope === hub.scope) {
              console.log('yes should do it!')
            } else {
              console.log('to Upstream nope -- hub.scope:', hub.scope, this._path)
              return
            }
            // check if event is a client with a scope?
          } else {
            console.log('to Downstream -- nope hub.scope:', hub.scope, this._path)
            return
          }
        }
      }

      if (this.connection && data !== void 0 && this._input) {
        let stamp = event.stamp
        if (typeof stamp !== 'string') {
          stamp = uuid + '-' + stamp
        }
        let output = this.parse(observable, hub, data, event)
        if (output !== void 0) {
          console.log('SEND!', '\nclient:', this.key, '\scope:', hub.scope, '\noutput:', output)
          this.connection.send(JSON.stringify({
            set: output,
            stamp: stamp
          }))
        }
      }
    }
  }
}).Constructor
