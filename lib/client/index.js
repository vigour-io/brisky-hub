'use strict'
// var colors = require('colors-browserify') //eslint-disable-line
var Syncable = require('../syncable')
var Observable = require('vigour-js/lib/observable')
var dataListener = Syncable.prototype._on.data.fn.adapter
var util = require('../util')
var isNetworkStamp = util.isNetworkStamp
var seperator = util.seperator

var ClientSyncable = new Syncable({
  // add block when not in scope do in a bit
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
    _subscallbacks: true
  },
  inject: [
    require('./parse'),
    require('./subscription/send'),
    require('./subscription/receive')
  ],
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
        console.log('payload it!')
        this.connection.origin.push(payload)
      }
    },
    send (observable, hub, data, event, subscriptions) {
      let id = hub.adapter.id
      let stamp = event.stamp
      let notString = typeof stamp !== 'string'
      console.log('send out?', data)
      if (
        this.connection &&
        (this._input && data !== void 0) &&
        (notString || stamp.indexOf(this._input) !== 0)
      ) {
        if (notString || !isNetworkStamp(stamp)) { // network stamp is slow
          stamp = id + seperator + stamp // this can just be done on the server
        }
        if (subscriptions) {
          this.sendSubscriptions(observable, hub, data, event, subscriptions, stamp)
        } else {
          if (hub.block.val) {
            return
          }
          console.log('sendSet')
          this.sendSet(observable, hub, data, event, stamp)
        }
      }
    }
  }
}).Constructor
