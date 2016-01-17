'use strict'
var merge = require('lodash/object/merge')
var hash = require('vigour-js/lib/util/hash')

exports.properties = {
  subscriptions: true
}

exports.define = {
  sendSubscriptions (observable, hub, data, stamp, callback) {
    console.log('SEND IT OUT--->', data)
    if (!this.hasOwnProperty('subscriptions')) {
      this.subscriptions = {}
    }
    var connection = this.connection && this.connection.origin
    var str = JSON.stringify(data)
    var hasher = hash(str) // lets make this better -- cached etc this is just to have a sensible id now!
    var subscription = { [hasher]: data }
    // lets write stamp to received subs ! thats SMART
    // then queing them will become a lot better
    merge(this.subscriptions, subscription)
    if (connection && connection.connected && connection.upstream._input) {
      let set = {
        client: {
          subscriptions: subscription, // need to do all at once!
          val: this.val
        },
        stamp: stamp
      }
      let scope = this.parent.parent.adapter.scope.val
      if (scope) {
        set.scope = scope
      }
      connection.push(set)
    } else {
      // console.warn('NOT CONNECTED DO NOTHING', this.subscriptions)
    }
  }
}
