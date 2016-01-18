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
        console.log('SEND IT OUT-???-->', data)

    var hasher = hash(str) // lets make this better -- cached etc this is just to have a sensible id now!
    var subscription = { [hasher]: data }
    // lets write stamp to received subs ! thats SMART
    // then queing them will become a lot better
    merge(this.subscriptions, subscription)
    console.log('SEND ITxxxxx OUT-???-->', data)

    if (connection && connection.connected && connection.upstream._input) {
      console.log('wtf')
      let set = {
        client: {
          subscriptions: subscription, // need to do all at once!
          val: this.val
        },
        stamp: stamp
      }
      console.log('2222222 SEND ITxxxxx OUT-???-->', data)

      let scope = this.parent.parent.adapter.scope.val
      if (scope) {
        set.scope = scope
      }
      console.log('3333333 SEND ITxxxxx OUT-???-->', data)

      connection.push(set)
    } else {
      console.log('wtf 2')
      // console.warn('NOT CONNECTED DO NOTHING', this.subscriptions)
    }
  }
}
