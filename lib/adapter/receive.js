'use strict'
var Event = require('vigour-js/lib/event')
exports.define = {
  receive (data, connection) {
    if (!data) {
      this.emit('error', 'no data to parse')
      return
    }
    if (!connection) {
      this.emit('error', 'no connection')
      return
    }
    let stamp = data.stamp
    console.log('in'.magenta, JSON.stringify(data, false, 2), this._path.join('.'), this.id.red.inverse)
    if (
      typeof stamp === 'string' &&
      data.stamp.indexOf(this.id + '|') === 0 // make this better
      // data.stamp.indexOf('|') === this.id.length - 1
    ) {
      console.error('FUCK!')
      this.emit('error', 'recieved own event ' + stamp)
      return
    }

    let hub = this._parent
    let event = new Event(hub, 'data', stamp)
    let scope = data.scope
    let id
    event.isTriggered = true
    if (connection === 'upstream') {
      event.upstream = true
    } else {
      // just add an extra thing that specifies that your chaning a scope probably best
      if (data.client) {
        id = data.client.val
        event.stamp = id + '|' + stamp
        data = this.swtichScope(data, event)
        console.log('hello?', event.stamp, stamp)
        if (!id) {
          event.remove()
          this.emit('error', 'client without id tries to connect')
          return
        }

        // handle this in client jsut passes subscriptions in a set
        var subs = data.client.subscriptions
        if (subs) {
          delete data.client.subscriptions
        }

        data.client.connection = connection
        if (scope) {
          hub = hub.getScope(scope)
        }
        hub.set({ clients: { [id]: data.client } }, event)
        if (connection.ip) {
          hub.clients[id].set({ ip: connection.ip })
        }

        if (subs) {
          if (subs.unsubscribe) {
            console.log('unsubscribe'.red.inverse, subs.unsubscribe)
            // make multiple possible on unsubscribe!!!! --
            // hub.clients[id]
            // make paths the keys don
            let target = hub
            if (subs.unsubscribe.path.length) {
              target = hub.get(subs.unsubscribe.path)
            }  // make this multiple!!!
            if (target) {
              for (let hashed in subs.unsubscribe.val) {
                // console.log('remove listener!', hashed, target._on[hashed].attach)

                console.log('REMOVE'.red, hashed)

                target.off(hashed, id)

                console.log('REMOVEsuc6 ???'.red, target._on[hashed].attach[id])

                // target.off(hashed, id)
                // console.log(target._on)
                // target.unsubscribe(hashed)
              }
            }
            delete subs.unsubscribe
          }
          for (var i in subs) {
            dosubs(hub, subs[i], hub.clients[id])
          }
        }
      } else if (connection) {
        if (scope) {
          hub = hub.getScope(scope, event)
        }
      } else {
        event.remove()
        this.emit('error', 'connection without client')
        return
      }
    }

    if (data.set) {
      hub.set(data.set, event)
    }
    event.trigger()
  }
}

function dosubs (hub, subscribe, client) {
  if (subscribe) {
    console.log('lulzzzz')
    // connection
    // console.error('xxxx', connection)
      // console.log(connection, event)
    // var client = hub.get(['clients', event.stamp.split('|')[0]], {
    //   connection: connection
    // })
    // console.log(client)
    // per client.id
    // console.log('subscribins!', subscribe, client.key)

    var sub = (subscribe.path && subscribe.path.length ? hub.get(subscribe.path, {}) : hub).subscribe(subscribe.val, [require('../../lib/syncable/on/subscription'), client], client.key)
    // console.log('HERE'.rainbow, sub)

    // use last stamp
    // console.log('skered')
    sub.run()
    // hub._on
  }
}
