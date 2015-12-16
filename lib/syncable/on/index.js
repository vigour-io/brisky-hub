'use strict'
var Protocol = require('../../protocol')
var Event = require('vigour-js/lib/event')
var hash = require('vigour-js/lib/util/hash')
var isEmpty = require('vigour-js/lib/util/is/empty')
var Observable = require('vigour-js/lib/observable')
var _subscribe = Observable.prototype.subscribe

exports.inject = require('./data')

exports.properties = {
  subsrefs: true,
  subscollectors: true,
  cachedSyncPath: true
}

exports.define = {
  subscribe (pattern) {
    var add
    // NEEDS GAURD
    // if (!this._on[subs.key]) {
    //   add = true
    // }
    var subs = _subscribe.apply(this, arguments)
    // if (!dontadd) {
    this.sendSubscriptionUpstream(this, subs.pattern, void 0, subs.key)
    // }
    return subs
  },
  unsubscribe (key, event) {
    console.log('dirt mc gurd 2', key)
    if (typeof key === 'string') {
      // this has to be handled better
      if (this.removeSubscription(key)) {
        let emitter = this._on && this._on[key]
        if (!event) {
          event = new Event(this, 'removeitsubs')
          event.stamp += 'subscription'
        }
        this.sendUpstream(void 0, event, { unsubscribe: { val: [ key ], path: this.syncPath } })
        // if (emitter) {
          // have to count listeners and shit
          // emitter.remove()
        // }
        // for non server hub this is wrong!
        // if emitter is empty
        // emitter.remove()
      }
    }
  },
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
  onSubRemove (emitter, event) {
    console.log('dirt mc gurd')
    if (!this.subsrefs) {
      return
    }
    let path = emitter._path.join('.')
    let hashed = this.subsrefs[path]
    if (hashed) {
      delete this.subsrefs[path]
      if (isEmpty(this.subsrefs)) {
        delete this.subsrefs
      }
      this.unsubscribe(hashed, event)
    }
  },
  addSubscription (key) {
    var newsub
    if (!this.hasOwnProperty('subscollectors')) {
      this.subscollectors = {}
    }
    if (!this.subscollectors[key]) {
      this.subscollectors[key] = 0
      newsub = true
    }
    this.subscollectors[key]++
    return newsub
  },
  removeSubscription (key) {
    if (this.subscollectors && this.subscollectors[key]) {
      this.subscollectors[key]--
      if (!this.subscollectors[key]) {
        delete this.subscollectors[key]
        if (isEmpty(this.subscollectors)) {
          delete this.subscollectors
        }
        return true
      }
    }
  },
  onSub (data, event, emitter, pattern, current, mapvalue, map, context) {
    var genpath = emitter.path.join('.')
    if (this.subsrefs && this.subsrefs[genpath]) {
      return
    }
    if (!this.hasOwnProperty('substore')) {
      this.subsrefs = {}
    }
    let key = this.sendSubscriptionUpstream(pattern, event)
    this.subsrefs[genpath] = key
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
  sendUpstream (data, event, subscribe) {
    var adapter = this.getAdapter()
    if (!adapter) {
      return
    }
    let eventorigin = this.parseEvent(event, adapter)
    if (!eventorigin) {
      return
    }
    if (!event.upstream) {
      adapter.each(
        (property) => property.client.origin.send(this, adapter.parent, data, event, eventorigin, subscribe),
        (property) => (property instanceof Protocol) && property._input && property.client
      )
    }
  },
  sendSubscriptionUpstream (pattern, event, key) {
    if (!event) {
      event = new Event(this, 'makeitsubs')
      event.stamp += 'subscription'
    }
    var path = this.syncPath
    var serialized = pattern.serialize()
    walker(serialized)
    if (!key) {
      key = hash(JSON.stringify(serialized))
    }
    if (this.addSubscription(key)) {
      this.sendUpstream(void 0, event, { [key]: { val: serialized, path: path } })
    }
    return key
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

function walker (val) {
  for (var i in val) {
    if (typeof val[i] === 'object') {
      walker(val[i])
    } else {
      val[i] = true
    }
  }
}
