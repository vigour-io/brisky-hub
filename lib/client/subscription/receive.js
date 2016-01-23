'use strict'
var setWithPath = require('vigour-js/lib/util/setWithPath')
var Event = require('vigour-js/lib/event')
var isEmpty = require('vigour-js/lib/util/is/empty')

exports.define = {
  receiveSubscriptions (observable, hub, map, event, attach, key) {
    // this, hub, map, event, attach, key
    // console.log('ok this client is the lucky one!', this.val, key, map)
    console.log('⬇️    subscription incoming!', JSON.stringify(map, false, 2))
    console.time('parse subscription ' + key)

    var top = {}
    var path = observable.syncPath
    var result = path.length === 0 ? top : setWithPath(top, path, {})
    observable.subscriptionWalker(
      false,
      hub,
      map,
      event,
      result,
      this,
      top,
      path
    )
    // EVENT HAS TO BE FIXED
    // console.log('subs lets send!', top)
    if (!isEmpty(result)) {
      var ev = new Event('subscription')
      // stamp has to become the subs stamp then were good
      this.connection.origin.send({
        stamp: hub.adapter.id + '|' + ev.stamp, // + id
        set: top
      })
    }

    console.timeEnd('parse subscription ' + key)

    // if (observable._subsstamps) {
    //   this._subsstamps
    // }
  }
}
