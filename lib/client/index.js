'use strict'
var Syncable = require('../syncable')
var Observable = require('vigour-js/lib/observable')
var _remove = Observable.prototype.remove
module.exports = new Syncable({
  properties: {
    connection: new Observable()
  },
  inject: require('./parse'),
  // on: {
  //   remove: {
  //     // references () {
  //     //   console.log('REMOVE CLIENT!', this._on, this._path)
  //     //   if (this.listensOnBase) {
  //     //     console.log('lulz remove!')
  //     //   }
  //     //   if (this.listensOnAttach) {
  //     //     console.log('lulz remove!')
  //     //   }
  //     // }
  //   }
  // },
  define: {
    // remove (data, event) {
    //   console.log('ok ok real remove', this._path)
    //   var on = this._on
    //   if (on && on.data) {
    //     if (on.data.base) {
    //       // console.log('kill it')
    //       on.data.base.each(function (property, key) {
    //         console.log(property._path)
    //         property.remove()
    //       })
    //     }
    //   }
    //   return _remove.apply(this, arguments)
    // },
    send (observable, hub, data, event, toUpstream) {
      let id = hub.adapter.id
      if (
        this.connection &&
        this._input &&
        data !== void 0
      ) {
        let stamp = event.stamp
        if (typeof stamp !== 'string' || stamp.indexOf('|') === -1) {
          stamp = id + '|' + stamp
        }
        let set = this.parse(observable, hub, data, event)
        if (set !== void 0) {
          let payload = {
            set: set,
            stamp: stamp
          }
          if (hub.adapter.scope.val) {
            payload.scope = hub.adapter.scope.val
          }
          this.connection.origin.send(payload)
        }
      }
    }
  }
}).Constructor
