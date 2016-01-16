'use strict'
var Observable = require('vigour-js/lib/observable')
var subscribe = Observable.prototype.subscribe
var Event = require('vigour-js/lib/event')
var Protocol = require('../../../protocol')
exports.define = {
  // subscribe: function (path, type, val) {
  //   var adapter = this.adapter || this.lookUp('adapter')
  //   if (adapter) {
  //     adapter.each((protocol) => {
  //       if (protocol.client) {
  //         let ev = new Event(type)
  //         let client = protocol.client.origin
  //         if (path === true) {
  //           path = '$'
  //         }
  //         // send out subscription
  //         client.origin.send(this, client._parent._parent, { [path]: { [type]: true } }, ev, true)
  //         ev.trigger()
  //       }
  //     }, (p) => p instanceof Protocol)
  //   }
  //   subscribe.apply(this, arguments)
  // }
  // subscribe itself is nto synced later however were going to make something univeral for this now i have to do the same as on element on things a walker etc etc
  $: function (map) {
    // this is the 'subscribe'
    console.log('ok lets go', map)
    //handle loader that will look a lot nicer
  }
}

exports.inject = require('./receive')
