'use strict'
var colors = require('colors-browserify') //eslint-disable-line
var Syncable = require('../syncable')
var Observable = require('vigour-js/lib/observable')
// var _remove = Observable.prototype.remove

module.exports = new Syncable({
  properties: {
    connection: new Observable(),
    subscriptions: true
  },
  inject: require('./parse'),
  define: {
    send (observable, hub, data, event, toUpstream, subscriptions) {
      let id = hub.adapter.id
      if (
        this.connection &&
        subscriptions || (this._input && data !== void 0)
      ) {
        let stamp = event.stamp
        if (subscriptions) {
          var payload
          if (subscriptions.unsubscribe) {
            console.log('UNSUBSCRIBE SEND IT!'.red, subscriptions.unsubscribe)
            if (this.subscriptions) {
              for (let key in subscriptions.unsubscribe.val) {
                delete this.subscriptions[key]
              }
            }
            payload = {
              client: {
                subscriptions: { unsubscribe: subscriptions.unsubscribe },
                val: id
              }
            }
          } else {
            payload = {
              client: {
                // make this to subscriptions -- make it by hash
                subscriptions: subscriptions,
                val: id
              },
              stamp: stamp // always my own stamp else this breaks make all this better later!
            }
            if (!this.subscriptions) {
              this.subscriptions = {}
              for (let key in subscriptions) {
                this.subscriptions[key] = subscriptions[key]
              }
            }
          }
          if (hub.adapter.scope.val) {
            payload.scope = hub.adapter.scope.val
          }
          console.log('SEND SUBSCRIPTIONS OUT!'.green.inverse, '--->'.bold, JSON.stringify(payload, false, 2))
          this.connection.origin.push(payload)
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
            console.log('SEND SET OUT!'.cyan.inverse, '--->'.bold, JSON.stringify(payload, false, 2))
            this.connection.origin.push(payload)
          }
        }
      }
    }
  }
}).Constructor
