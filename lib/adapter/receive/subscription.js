'use strict'
var isHash = /^[a-z\d]{5,7}$/
exports.define = {
  // hub.adapter.receiveSubscriptions(hub, subs, id, event)
  receiveSubscriptions (hub, subscriptions, id, event) {
    var client = hub.clients[id]
    if (typeof subscriptions !== 'object') {
      this.emit('error', 'receiveSubscriptions: 💩 subscriptions is not an object')
      return
    }
    console.log('⬇️  receiveSubscriptions', event.stamp, Object.keys(subscriptions))
    for (let path in subscriptions) {
      let field = path === '$' ? hub : hub.get(path, {})
      for (let sub in subscriptions[path]) {
        if (typeof sub !== 'string' || !isHash.test(sub)) {
          this.emit('error', 'receive: 💩 malformed subscription request')
          return
        }
        let subs = subscriptions[path][sub]
        field.$(subs ? subs.$map : subs, event, client.receiveSubscriptions, client, sub)
      }
    }
  },
  receiveSubscriptionResults (hub, subscriptions) {
    // on ⬇️ data.set -- this gives extra info about the subs involved
    // console.log('receiveSubscriptionResults')
    // important! have to fire callbacks
    // this is why it would be super good to use listeners -- they have to be shared etc etcs
    // do this last
    // this has to be habndled on something like    -- subscription --- set
  }
}
