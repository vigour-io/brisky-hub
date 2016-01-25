'use strict'
var setWithPath = require('vigour-js/lib/util/setwithpath')
var Event = require('vigour-js/lib/event')
var isEmpty = require('vigour-js/lib/util/is/empty')

exports.define = {
  receiveSubscriptions (observable, hub, map, event, attach, hash, protocol) {
    // needs protocol here
    if (map === null) {
      console.log('start of the fun')
    }

    if (!hash) {
      return
    }

    var top = {}
    var path = observable.syncPath
    var result = path.length === 0 ? top : setWithPath(top, path, {})

    if (map === null) {
      let lPath = path.length === 0 ? '$' : path.join('.')
      // console.log()
      console.log('remove subs find in --> ' + protocol.key + '.client.origin.subscriptions.' + lPath + '.' + hash)
      map = hub.adapter.get([ protocol.key, 'client', 'origin', 'subscriptions', lPath, hash, '$map' ])
      if (!map) {
        console.log('cant find')
        return
      }
      result = top = null
    }

    observable.subscriptionWalker(
      false,
      hub,
      map,
      event,
      result,
      this,
      top,
      path,
      hash
    )

    if (result && !isEmpty(result)) {
      var ev = new Event('subscription')
      // stamp has to become the subs stamp then were good
      this.connection.origin.send({
        stamp: hub.adapter.id + '|' + ev.stamp, // + id
        set: top
      })
    } else if (!result) {
      console.log('DONE UNSUBSCRIBING', hash)
    }
  }
}

// also this is a thing in attach removal thats wrong so good find
