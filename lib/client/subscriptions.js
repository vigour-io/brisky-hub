'use strict'
var merge = require('lodash/object/merge')

exports.properties = {
  subscriptions: true
}

exports.define = {
  sendSubscriptions (observable, hub, data, stamp) {
    console.log('SEND IT OUT--->', data)
    if (!this.hasOwnProperty('subscriptions')) {
      this.subscriptions = {}
    }

    console.log(data)
    var path = observable.syncPath.join('.')
    var connection = this.connection && this.connection.origin
    var subscription = { [path]: data }
    // this only one ofcourse weird
    merge(this.subscriptions, subscription)
    if (connection && connection.connected) {
      console.warn('CONNECTED RDY TO SUBSCRIBE')
      connection.push({
        client: {
          subscriptions: subscription,
          val: this.val
        },
        stamp: stamp
      })
    } else {
      console.warn('NOT CONNECTED DO NOTHING', this.subscriptions)
    }
  }
}
