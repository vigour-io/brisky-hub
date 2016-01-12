'use strict'

exports.properties = {
  _subscriptions: true
}

exports.define = {
  sendSubscriptions (observable, hub, data, stamp) {
    console.log('SEND IT OUT--->', data)
    if (!this.hasOwnProperty('_subscriptions')) {
      this._subscriptions = {}
    }
    console.log(data)
    var path = observable.syncPath

  }
}
