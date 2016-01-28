'use strict'
var util = require('../../util')
var isNetworkStamp = util.isNetworkStamp
var seperator = util.seperator

exports.define = {
  getAdapter () {
    let adapter
    let parent = this
    while (!adapter && parent) {
      adapter = parent.adapter
      if (!adapter) {
        parent = parent.parent
      }
    }
    if (!adapter) {
      this.emit('error', 'no adapter yet')
      return
    }
    return adapter
  },
  parseEvent (event, adapter) {
    var id = adapter.id
    var stamp = event.stamp
    var eventorigin = (
      typeof stamp === 'string' &&
      isNetworkStamp(stamp) &&
      stamp.slice(0, event.stamp.indexOf(seperator))
    ) || id
    return eventorigin
  },
  hub: {
    get () {
      var p = this
      while (p && !p.adapter) {
        p = p._parent
      }
      return p
    }
  }
}
