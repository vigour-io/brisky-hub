'use strict'
var Syncable = require('../syncable')
var Observable = require('vigour-js/lib/observable')
module.exports = new Syncable({
  properties: {
    connection: new Observable()
  },
  inject: require('./parse'),
  define: {
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
          // make this more elegant this feels very shitty to do everywhere
          if (typeof hub.adapter.scope.val === 'string') {
            payload.scope = hub.adapter.scope.val
          }
          this.connection.origin.send(payload)
        }
      }
    }
  }
}).Constructor
