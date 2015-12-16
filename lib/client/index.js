'use strict'
var colors = require('colors-browserify') //eslint-disable-line
var Syncable = require('../syncable')
var Observable = require('vigour-js/lib/observable')
var dataListener = Syncable.prototype._on.data.fn.adapter

var ClientSyncable = new Syncable({
  on: {
    data: {
      adapter (data, event) {
        let adapter = this.lookUp('adapter')
        adapter = adapter && adapter.parent
        // console.log('here!', adapter && adapter._path)
        if (adapter && (!adapter.block || !adapter.block.clients || !adapter.block.clients.val)) {
          // console.log('XXXXXsend out!'.green)
          dataListener.apply(this, arguments)
        } else {
          // console.log('wtf!', adapter && adapter.block.clients.val)
        }
      }
    }
  },
  ChildConstructor: 'Constructor'
}).Constructor

module.exports = new ClientSyncable({
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
            console.log('unsubscribe'.green.inverse, '--->'.bold, JSON.stringify(payload, false, 2))
            if (this.subscriptions) {
              for (let key in subscriptions.unsubscribe.val) {
                delete this.subscriptions[subscriptions.unsubscribe.val[key]]
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
                subscriptions: subscriptions,
                val: id
              },
              stamp: stamp
            }
            if (!this.subscriptions) {
              this.subscriptions = {}
            }
            for (let key in subscriptions) {
              this.subscriptions[key] = subscriptions[key]
            }
          }
          if (hub.adapter.scope.val) {
            payload.scope = hub.adapter.scope.val
          }
          console.log('SEND SUBSCRIPTIONS OUT!'.green.inverse, '--->'.bold, JSON.stringify(payload, false, 2))
          if (this.connection.origin.connected) { // dirty at this spot needs same spot as connection -- or reconnect needs t filter it out
            this.connection.origin.push(payload)
          }
        } else {
          let set = this.parse(observable, hub, data, event)
          if (typeof stamp !== 'string' || stamp.indexOf('|') === -1) {
            stamp = id + '|' + stamp // this can just be done on the server
          }
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
