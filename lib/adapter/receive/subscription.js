'use strict'
var isHash = /^[a-z\d]{5,7}$/
exports.define = {
  receiveSubscriptions (hub, subscriptions, id, event) {
    var client = hub.clients[id]
    if (typeof subscriptions !== 'object') {
      this.emit('error', 'receiveSubscriptions: 💩  subscriptions is not an object')
      return
    }
    for (let path in subscriptions) {
      let field = (path === '$' ? hub : hub.get(path))

      if (!field) {
        // WALKER MULTIPLE SCOPES
        if (hub.scope) {
          // this has to be replaced everywhere with soemthing like origin dont know...
          hub.originalHub.get(path, {}) // this keep compat for nwo
        }
        field = hub.get(path, {})
        // console.log('??? ERROR CANT GET OR CREATE FIELD (incoming subs)', path)
      }

      for (let sub in subscriptions[path]) {
        if (typeof sub !== 'string' || !isHash.test(sub)) {
          this.emit('error', 'receive: 💩  malformed subscription request -- keys need to be subscription-hashes')
          return
        }

        // also valid for null
        if (typeof subscriptions[path][sub] !== 'object') {
          this.emit('error', 'receive: 💩  malformed subscription map -- map needs to be an object')
          return
        }

        if (
          subscriptions[path][sub] !== null &&
          (
            !subscriptions[path][sub].$map ||
            typeof subscriptions[path][sub].$map !== 'object'
          )
        ) {
          this.emit('error', 'receive: 💩  malformed subscription map -- needs $map object')
          return
        }
        let subs = subscriptions[path][sub]
        // console.log('incoming subs!!!!', path, sub)
        // if (subs === null) {
        //   console.log('hit', path, sub)
        // }
        field.$(subs ? subs.$map : subs, event, client.receiveSubscriptions, client, sub)
      }
    }
  },
  receiveSubscriptionResults (hub, subscriptions) {
    // on ⬇️ data.set -- this gives extra info about the subs involved
    // important! have to fire callbacks
    // this is why it would be super good to use listeners -- they have to be shared etc etcs
    // do this last
    // this has to be habndled on something like    -- subscription --- set
  }
}
