'use strict'
var util = require('../../util')
var isNetworkStamp = util.isNetworkStamp
var seperator = util.seperator

exports.inject = [
  require('./upstream'),
  // require('./subscribe')
]

exports.properties = {
  cachedSyncPath: true
}

exports.define = {
  syncPath: {
    get () {
      var parent = this
      var path = []
      if (this.cachedSyncPath) {
        return this.cachedSyncPath
      }
      while (parent && parent.key && !parent.adapter) {
        path.unshift(parent.key)
        parent = parent._parent
      }
      this.cachedSyncPath = path
      return path
    }
  },
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
  }
}
