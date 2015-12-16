'use strict'
var Observable = require('vigour-js/lib/observable')
var SubsEmitter = require('vigour-js/lib/observable/subscribe/constructor')
var Protocol = require('../../protocol')
var Event = require('vigour-js/lib/event')
var hash = require('vigour-js/lib/util/hash')
var isEmpty = require('vigour-js/lib/util/is/empty')

module.exports = function (syncable, event) {
  var Syncable = syncable.Constructor
  exports.properties = {
    subsrefs: true,
    subsmap: true
  }
  exports.define = {
    syncPath: {
      get () {
        var parent = this
        var path = []
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
      console.log('murk'.rainbow, path, this.syncPath)
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
      console.error('onSub')
      var genpath = emitter.path.join('.')
      if (this.substore && this.substore[genpath]) {
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
  exports.inject = require('./data')
  syncable.inject(exports)
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
