'use strict'
exports.inject = [
  require('./upstream'),
  require('./subscribe')
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
    let id = adapter.id
    let eventorigin = (
      event.stamp.indexOf &&
      event.stamp.indexOf('|') &&
      event.stamp.slice(0, event.stamp.indexOf('|'))
    ) || id
    return eventorigin
  }
}
