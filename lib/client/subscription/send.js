'use strict'

exports.define = {
  sendSubscriptions (observable, hub, data, event, subscriptions, stamp) {
    var connection = this.connection && this.connection.origin
    if (connection && connection.connected && connection.upstream._input) {
      console.log('⬆️ send subscription', stamp, JSON.stringify(data))
      let set = {
        client: {
          subscriptions: data,
          val: this.val
        },
        stamp: stamp
      }
      console.log('dirty!', set)
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
