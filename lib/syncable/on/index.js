'use strict'
var Protocol = require('../../protocol')
var Event = require('vigour-js/lib/event')
var hash = require('vigour-js/lib/util/hash')
var isEmpty = require('vigour-js/lib/util/is/empty')

exports.inject = require('./data')

exports.properties = {
  subsrefs: true,
  subsmap: true,
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
      return path
    }
  },
  onSubRemove (emitter) {
    if (!this.substore) {
      return
    }
    let path = emitter._path.join('.')
    let hashed = this.substore[path]
    if (hashed) {
      delete this.substore[path]
      if (isEmpty(this.substore)) {
        delete this.substore
      }
      if (this.subscollectors && this.subscollectors[hashed]) {
        this.subscollectors[hashed]--
        if (!this.subscollectors[hashed]) {
          this.sendUpstream(void 0, event, { unsubscribe: { val: [ hashed ], path: this.syncPath } })
          delete this.subscollectors[hashed]
          if (isEmpty(this.subscollectors)) {
            delete this.subscollectors
          }
        }
      }
    }
  },
  onSub (data, event, emitter, pattern, current, mapvalue, map, context) {
    var genpath = emitter.path.join('.')
    if (this.substore && this.substore[genpath]) {
      // lookup voor dit
      return
    }
    if (!this.hasOwnProperty('substore')) {
      this.substore = {}
    }
    let key = sendSubsUp(this, pattern)
    if (!this.hasOwnProperty('subscollectors')) {
      this.subscollectors = {}
    }
    if (!this.subscollectors[key]) {
      this.subscollectors[key] = 0
    }
    this.subscollectors[key]++
    this.substore[genpath] = key
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

function sendSubsUp (base, pattern, key) {
  var event = new Event(base, 'makeitsubs')
  event.stamp += 'subscription'
  var path = base.syncPath
  var serialized = pattern.serialize()
  walker(serialized)
  if (!key) {
    key = hash(JSON.stringify(serialized))
  }
  base.sendUpstream(void 0, event, { [key]: { val: serialized, path: path } })
  return key
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
