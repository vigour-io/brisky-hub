'use strict'
// var colors = require('colors-browserify') //eslint-disable-line
var Syncable = require('../syncable')
var Observable = require('vigour-js/lib/observable')
var dataListener = Syncable.prototype._on.data.fn.adapter
var util = require('../util')
var isNetworkStamp = util.isNetworkStamp
var seperator = util.seperator

var ClientSyncable = new Syncable({
  on: {
    data: {
      adapter (data, event) {
        let adapter = this.lookUp('adapter')
        adapter = adapter && adapter.parent
        if (
          adapter &&
          (
            !adapter.block ||
            adapter.block.clients ||
            !adapter.block.clients.val
          )
        ) {
          dataListener.apply(this, arguments)
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
    send (observable, hub, data, event, toUpstream) {
      console.log('send send send', data)
      let id = hub.adapter.id
      if (
        this.connection &&
        (this._input && data !== void 0)
      ) {
        let stamp = event.stamp
        let set = this.parse(observable, hub, data, event)
        if (typeof stamp !== 'string' || !isNetworkStamp(stamp)) {
          stamp = id + seperator + stamp // this can just be done on the server
        }
        if (set !== void 0) {
          let payload = {
            set: set,
            stamp: stamp
          }
          if (hub.adapter.scope.val) {
            payload.scope = hub.adapter.scope.val
          }
          // console.log('SEND PAYLOAD OUT!'.magenta.inverse, '--->'.bold, JSON.stringify(payload, false, 2))
          this.connection.origin.push(payload)
        }
      }
    }
  }
}).Constructor
