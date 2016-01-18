'use strict'

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
  }
}

exports.properties = {
  cachedSyncPath: true
}
