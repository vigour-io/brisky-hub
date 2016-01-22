'use strict'
var setWithPath = require('vigour-js/lib/util/setWithPath')
var Event = require('vigour-js/lib/event')

exports.define = {
  receiveSubscriptions (observable, hub, map, event, attach, key) {
    // this, hub, map, event, attach, key
    console.log('ok this client is the lucky one!', this.val, key, map)
    // console.log()
    var top = {}
    var path = observable.syncPath
    var result = path.length < 1 ? top : setWithPath(top, path, {})
    observable.subscriptionWalker(
      false,
      hub,
      map,
      event,
      result,
      this,
      top
    )
    // EVENT HAS TO BE FIXED
    console.log('subs lets send!', top)
    var ev = new Event('subscription')
    this.connection.origin.send({
      stamp: hub.adapter.id + '|' + ev.stamp, // + id
      set: top
    })
    // if (observable._subsstamps) {
    //   this._subsstamps
    // }
  }
}
