'use strict'
var Syncable = require('../syncable')
var Observable = require('vigour-js/lib/observable')
var _remove = Observable.prototype.remove
module.exports = new Syncable({
  properties: {
    connection: new Observable()
  },
  inject: require('./parse'),
  define: {
    remove (event, nocontext, noparent) {
      return _remove.call(this, event, nocontext, noparent)
    },
    send (observable, hub, data, event, toUpstream) {
      let id = hub.adapter.id
      if (
        this.connection &&
        this._input &&
        data !== void 0
      ) {
        let stamp = event.stamp
        if (typeof stamp !== 'string') {
          stamp = id + '-' + stamp
        }
        let set = this.parse(observable, hub, data, event)
        if (set !== void 0) {
          let payload = {
            set: set,
            stamp: stamp
          }
          if (hub.adapter.scope) {
            payload.scope = hub.adapter.scope.val
          }
          this.connection.origin.send(payload)
        }
      }
    }
  }
}).Constructor
