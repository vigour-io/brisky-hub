'use strict'
var Observable = require('vigour-js/lib/observable')
var SubsEmitter = require('vigour-js/lib/observable/subscribe/constructor')
var Protocol = require('../../protocol')
var Event = require('vigour-js/lib/event')
var hash = require('vigour-js/lib/util/hash')

module.exports = function (syncable, event) {
  var Syncable = syncable.Constructor
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
    },
    on (type, attach) {
      var ret = Observable.prototype.on.apply(this, arguments)
      var base = ret || this
      if (typeof type === 'string') {
        if (base._on && base._on[type] instanceof SubsEmitter) {
          sendSubsUp(base, base._on[type].pattern, type)
        } else if (type !== 'remove' && type !== 'reference' && attach && attach[1] instanceof SubsEmitter) {
          var parent = attach && attach[1]._parent
          while (parent) {
            if (parent instanceof Syncable) {
              console.error('WRONG! subscribed directly to synacable!')
              return ret
            }
            parent = parent._parent
          }
          sendSubsUp(base, attach[2][1].parent)
        }
      }
      return ret
    }
  }
  exports.inject = require('./data')
  syncable.inject(exports)
}

function sendSubsUp (base, pattern, key) {
  var event = new Event(base, 'makeitsubs')
  event.stamp += 'subscription'
  var path = base._path
  var serialized = pattern.serialize()
  walker(serialized)
  path.pop()
  if (!key) {
    key = hash(JSON.stringify(serialized))
  }
  base.sendUpstream(void 0, event, { [key]: { val: serialized, path: path } })
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
