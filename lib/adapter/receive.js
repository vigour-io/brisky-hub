'use strict'
var Event = require('vigour-js/lib/event')
var util = require('../util')
var seperator = util.seperator
var isNetworkStamp = util.isNetworkStamp

exports.define = {
  receive (data, connection) {
    // console.log('RECEIVE'.bold.white.inverse, '--->'.bold, JSON.stringify(data, false, 2), '\n', this._path.join('.').blue.bold)
    if (!data) {
      this.emit('error', 'no data to parse')
      return
    }

    if (!connection) {
      this.emit('error', 'no connection')
      return
    }
    let stamp = data.stamp
    let isString = typeof stamp === 'string'
    if (
      isString &&
      this.isOrigin(data.stamp)
    ) {
      this.emit('error', 'recieved own event ' + stamp)
      return
    }

    // console.log(' IN stamp -->'.bold.magenta.inverse, stamp, '\n', JSON.stringify(data, false, 2), '\n END IN '.bold.magenta.inverse)

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
        if (!isString || !isNetworkStamp(stamp)) {
          event.stamp = id + seperator + stamp
        }
        data = this.swtichScope(data, event)
        if (!id) {
          event.remove()
          this.emit('error', 'client without id tries to connect')
          return
        }

        let subs = data.client.subscriptions
        if (subs) {
          delete data.client.subscriptions
        }

        data.client.connection = connection
        if (scope) {
          hub = hub.getScope(scope)
        }
        hub.set({ clients: { [id]: data.client } }, event)

        if (subs) {
          if (scope) {
            console.log('scope: ', ('[' + scope + ']').white.bold.inverse)
          }
          console.log('set subs seem to work'.blue.bold)
          hub.receiveSubscription(subs, id, event)
        }

        if (connection.ip) {
          hub.clients[id].set({ ip: connection.ip })
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
      // console.log('receive --> set:'.green, hub.adapter.id, ' \n', JSON.stringify(data.set, false, 2))

      hub.set(data.set, event)
    }
    event.trigger()
  }
}
