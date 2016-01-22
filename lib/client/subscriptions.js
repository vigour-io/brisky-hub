'use strict'
var merge = require('lodash/object/merge')
var hash = require('vigour-js/lib/util/hash')

exports.properties = {
  subscriptions: true
}

exports.define = {
  sendSubscriptions (observable, hub, data, stamp, callback) {
    if (!this.hasOwnProperty('subscriptions')) {
      this.subscriptions = {}
    }
    var connection = this.connection && this.connection.origin
    var str = JSON.stringify(data)

    // again lets just work with a subs object thats shared.. this is just slow!
    // lets store the hash as well

    // how to do effiiently -- this is a lot of double crap
    console.log(data)
    // need a way to find the hash way way way faster
    // what about combined path + hash?
    var hasher = hash(str) // lets make this better -- cached etc this is just to have a sensible id now!

    if (callback) {
      if (!this.hasOwnProperty('_subscallbacks')) {
        this._subscallbacks = {}
      }
      console.log(hasher)
      if (!this._subscallbacks[hasher]) {
        this._subscallbacks[hasher] = []
      }
      this._subscallbacks[hasher].push(callback)
    }

    // so annoying!
    if (this.subscriptions[hasher]) {

      if (callback) {
        console.error('fire ready or add to array when not rly rdy')
      }
      // last result for the subscription else cb is too fast!

      // on receive this has to fire!


      // if (callback) {
      //   callback()
      // }
      // callback
      // console.log('allrdy have subscription!', hasher)
      return
    }

    var subscription = { [hasher]: data }
    // lets write stamp to received subs ! thats SMART
    // then queing them will become a lot better
    merge(this.subscriptions, subscription)

    if (connection && connection.connected && connection.upstream._input) {
      console.log('resend?')
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
