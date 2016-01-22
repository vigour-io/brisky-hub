'use strict'

exports.define = {
  sendSubscriptions (observable, hub, data, event, subscriptions, stamp) {
    console.log('send it out', data)
    var connection = this.connection && this.connection.origin
    if (connection && connection.connected && connection.upstream._input) {
      console.log('⬆️ send subscription', stamp)
      let set = {
        client: {
          subscriptions: data,
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
