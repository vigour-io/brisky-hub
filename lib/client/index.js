'use strict'
var Syncable = require('../syncable')
var Observable = require('vigour-js/lib/observable')
// var _remove = Observable.prototype.remove
module.exports = new Syncable({
  properties: {
    connection: new Observable()
  },
  inject: require('./parse'),
  define: {
    send (observable, hub, data, event, toUpstream, subscribe) {
      let id = hub.adapter.id
      if (
        this.connection &&
        subscribe || (this._input && data !== void 0)
      ) {
        let stamp = event.stamp
        if (typeof stamp !== 'string' || stamp.indexOf('|') === -1) {
          stamp = id + '|' + stamp
        }

        if (subscribe) {

          let payload = {
            subscribe: subscribe.serialize(),
            stamp: stamp
          }
          if (hub.adapter.scope.val) {
            payload.scope = hub.adapter.scope.val
          }
          this.connection.origin.push(payload)

          // console.log('LULZ!!!!!', subscribe.serialize())

        } else {
          let set = this.parse(observable, hub, data, event)
          if (set !== void 0) {
            let payload = {
              set: set,
              stamp: stamp
            }
            if (hub.adapter.scope.val) {
              payload.scope = hub.adapter.scope.val
            }
            this.connection.origin.push(payload)
          }
        }
      }
    }
  }
}).Constructor
