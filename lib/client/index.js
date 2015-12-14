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
        // if (typeof stamp !== 'string' || stamp.indexOf('|') === -1) {
        //   // stamp = id + '|' + stamp //do this on the reciever
        // }

        if (subscriptions) {
          console.log('---------')

          if (!this.subscriptions) {
            this.subscriptions = {}
            for (let key in subscriptions) {
              this.subscriptions[key] = subscriptions[key]
            }
          }

          console.log('---------')

          // like a merge...
          // parse subs here and use client connection
          let payload = {
            client: {
              // make this to subscriptions -- make it by hash
              subscriptions: subscriptions,
              val: id
            },
            stamp: stamp // always my own stamp else this breaks make all this better later!
          }

          // remove htis dirt
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
