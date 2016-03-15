'use strict'
var Syncable = require('../syncable')
var dataListener = Syncable.prototype._on.data.fn.adapter
var util = require('../util')
var isNetworkStamp = util.isNetworkStamp
var seperator = util.seperator

var ClientSyncable = new Syncable({
  type: 'client',
  noContext: true,
  noInstance: true,
  // add block when not in scope do in a bit
  on: {
    data: {
      adapter (data, event) {
        let adapter = this.lookUp('adapter')
        adapter = adapter && adapter.parent

        // block need to become more elegant
        if (
          adapter &&
          (
            !adapter.block ||
            adapter.block.clients ||
            !adapter.block.clients.val
          )
        ) {
          console.log('sync client info?')
          // dataListener.apply(this, arguments)
        }
      }
    }
  },
  ChildConstructor: 'Constructor'
}).Constructor

module.exports = new ClientSyncable({
  properties: {
    connection: { type: 'observable' },
    _subscallbacks: true
  },
  inject: require('./parse'),
  define: {
    sendSet (observable, hub, data, event, stamp) {
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
    },
    send (observable, hub, data, event, subscriptions) {
      let id = hub.adapter.id
      let stamp = event.stamp
      let notString = typeof stamp !== 'string'
      if (
        this.connection &&
        (this.__input && data !== void 0) &&
        (notString || stamp.indexOf(this.__input) !== 0)
      ) {
        if (notString || !isNetworkStamp(stamp)) { // network stamp is slow
          stamp = id + seperator + stamp // this can just be done on the server
        }
        if (hub.block.val) {
          return
        }
        this.sendSet(observable, hub, data, event, stamp)
      }
    }
  }
}).Constructor
