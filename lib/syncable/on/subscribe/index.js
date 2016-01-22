'use strict'
// var Observable = require('vigour-js/lib/observable')
// var subscribe = Observable.prototype.subscribe
var Event = require('vigour-js/lib/event')
var Protocol = require('../../../protocol')
// var hash = require('vigour-js/lib/util/hash')
// function handleRemove (data, event, client, map) {
//   console.error('HAVE TO REMOVE HAVE TO RMEOVE!!!', JSON.stringify(map, false, 2))
// }
exports.define = {
  $ (map, attach, ready) {
    // console.warn('outgoing subs', JSON.stringify(map, false, 2))
    // send out the previous stamp for this

    if (attach) {
      // temp fix element needs to emit on remove !!!! else where fucked ofcourse...
      // attach.on('remove', [handleRemove, this, map])
    }
    // now what we need to do is just maybe handle refs differently when no scope :/
    var path
    var adapter = this.lookUp('adapter') || this.adapter  // this.getAdapter()
    if (adapter) {
      adapter.each((protocol) => {
        if (protocol.client) {
          if (!path) {
            path = this.syncPath.join('.')
          }
          let ev = new Event('subscribe')
          let client = protocol.client.origin
          if (path === true || !path) {
            path = '$'
          }
          // console.log('send subs!')
          client.origin.send(this, client._parent._parent, { [path]: map }, ev, ready || true)
          ev.trigger()
        }
      }, (p) => p instanceof Protocol)
    }
  }
}

// only for hub
exports.inject = require('./receive')
