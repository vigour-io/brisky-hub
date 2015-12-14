'use strict'
var colors = require('colors-browserify')
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

      function walker (val) {
        for (var i in val) {
          if (typeof val[i] === 'object') {
            walker(val[i])
          } else {
            // console.log(i, val[i])
            val[i] = true
          }
        }
      }

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
            subscribe: subscribe,
            stamp: stamp
          }
          walker(payload.subscribe.val)
          // console.log(payload.subscribe)

          if (hub.adapter.scope.val) {
            payload.scope = hub.adapter.scope.val
          }

          console.log('SEND SUBSCRIPTIONS OUT!'.green.inverse, '--->'.bold, JSON.stringify(payload, false, 2))

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
            console.log('SEND OUT!'.cyan.inverse, '--->'.bold, JSON.stringify(payload, false, 2))
            this.connection.origin.push(payload)
          }
        }
      }
    }
  }
}).Constructor
