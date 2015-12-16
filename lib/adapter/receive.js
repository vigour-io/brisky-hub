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
      console.log('received my own event should never be possible freund')
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
      if (data.client) {
        id = data.client.val
        if (typeof stamp !== 'string' || !~stamp.indexOf('|')) {
          event.stamp = id + '|' + stamp
          console.log('!!!!!', stamp, event.stamp)
        }
        data = this.swtichScope(data, event)
        if (!id) {
          event.remove()
          this.emit('error', 'client without id tries to connect')
          return
        }

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
            let target = hub
            if (subs.unsubscribe.path.length) {
              target = hub.get(subs.unsubscribe.path)
            }
            if (target) {
              for (let j in subs.unsubscribe.val) {
                console.log('REMOVE SUBS'.red, subs.unsubscribe.val[j], id)
                target.off(subs.unsubscribe.val[j], id)
              }
            }
            delete subs.unsubscribe
          }
          for (let hashed in subs) {
            dosubs(hub, subs[hashed], hub.clients[id], hashed)
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

function dosubs (hub, subscribe, client, hashed) {
  if (subscribe) {
    var target = (subscribe.path && subscribe.path.length ? hub.get(subscribe.path, {}) : hub)
    if (target._on && (!target._on[hashed] || !target._on[hashed].attach || !target._on[hashed].attach[client])) {
      console.log('subscribing on:', subscribe.val, target.syncPath)

      // need to pass on event in .subscribe!!!
      // this way it stays intact

      var sub = target.subscribe(subscribe.val, [require('../../lib/syncable/on/subscribe/listener'), client], client.key)
      sub.run()
      // var event = new Event(target, sub.key)
      // event.isTriggered = true
      // sub.run(void 0, event, client.key)
      // event.trigger()
    }
  }
}
