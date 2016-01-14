'use strict'
var Observable = require('vigour-js/lib/observable')
var subscribe = Observable.prototype.subscribe
var Event = require('vigour-js/lib/event')
var Protocol = require('../../../protocol')
exports.define = {
  subscribe: function (path, type, val) {
    // lets send this upstream!
    // console.log('yo yo yo', path, type, val)
    // send (observable, hub, data, event, toUpstream, subscribe) {
    var adapter = this.adapter || this.lookUp('adapter')
    // console.log(this._path)
    if (adapter) {
      adapter.each((protocol) => {
        if (protocol.client) {
          let ev = new Event(type)
          let client = protocol.client.origin
          // observable, hub, data, event, subscriptions
          if (path === true) {
            path = '$'
          }
          // console.log('subscribe:', type, this.syncPath.join('.'), ':', path)
          client.origin.send(this, client._parent._parent, { [path]: { [type]: true } }, ev, true)
          ev.trigger()
        }
      }, (p) => p instanceof Protocol)
    }
    // so wrong
    subscribe.apply(this, arguments)
  }
}

exports.inject = require('./receive')
