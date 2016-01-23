'use strict'
var setWithPath = require('vigour-js/lib/util/setWithPath')
var Event = require('vigour-js/lib/event')
var isEmpty = require('vigour-js/lib/util/is/empty')

exports.define = {
  receiveSubscriptions (observable, hub, map, event, attach, hash) {
    // this, hub, map, event, attach, hash
    // console.log('ok this client is the lucky one!', this.val, hash, map)
    console.log('⬇️    subscription incoming!', JSON.stringify(map, false, 2), hash)
    console.time('parse subscription ' + hash)

    var top = {}
    var path = observable.syncPath
    var result = path.length === 0 ? top : setWithPath(top, path, {})

    if (map === null) {
      console.log('websocket.client.origin.subscriptions.' + path.join('.') + '.' + hash)
      map = hub.adapter.get([ 'websocket', 'client', 'origin', 'subscriptions', path.join('.'), hash, '$map' ])
      if (!map) {
        console.log('cant find map allrdy removed!')
        return
      } else {
        console.log('MAP!', map)
      }
      result = top = null
    }

    if (!hash) {
      console.log('!@#@!#!@#!@!@##!@!@#!@#', observable.path)
    }
    console.timeEnd('parse subscription ' + hash)
    console.log(hash)
    //key, hub, map, event, result, client, top, path, hash
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
    console.log('done!')
    // EVENT HAS TO BE FIXED
    // console.log('subs lets send!', top)
    if (result && !isEmpty(result)) {
      var ev = new Event('subscription')
      // stamp has to become the subs stamp then were good
      this.connection.origin.send({
        stamp: hub.adapter.id + '|' + ev.stamp, // + id
        set: top
      })
    }


    // if (observable._subsstamps) {
    //   this._subsstamps
    // }
  }
}
