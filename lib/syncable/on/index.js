'use strict'
var Observable = require('vigour-js/lib/observable')
var SubsEmitter = require('vigour-js/lib/observable/subscribe/constructor')
var Protocol = require('../../protocol')
var Event = require('vigour-js/lib/event')

module.exports = function (syncable, event) {
  console.log(syncable, event)
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
      // console.log('----- ok were doing something! -->'.green, arguments)
      var ret = Observable.prototype.on.apply(this, arguments)
      var base = ret || this
      if (typeof type === 'string') {
        var event
        if (base._on && base._on[type] instanceof SubsEmitter) {
          // need an event
          // use last stamp
          event = new Event(base, 'makeitsubs')
          event.stamp += 'makeitNOW' + type

          base.sendUpstream(void 0, event, base._on[type].pattern)
          // console.log('suc6'.rainbow)
        } else if (type !== 'remove' && type !== 'reference' && attach && attach[1] instanceof SubsEmitter) {
          var parent = attach && attach[1]._parent
          while (parent) {
            if (parent instanceof Syncable) {
              console.error('WRONG! subscribed directly to synacable!')
              return ret
            }
            parent = parent._parent
          }
          // and i dont habe the subsemitter right
          // :-)
          //
          // console.log(attach, attach[2], type.magenta)

          // console.log('loggins', attach[2] && attach[2][1].parent.serialize(), base.path, type)

          event = new Event(base, 'makeitsubs')
          event.stamp += 'makeitNOW' + type
          // console.log(attach[2][1])
          // use last stamp
          // console.log('SEND UP', JSON.stringify(attach[2][1].parent.serialize())
          base.sendUpstream(void 0, event, attach[2][1].parent)
          // console.log('suc62'.rainbow)
        }
      }
      return ret
    }
  }
  exports.inject = require('./data')
  syncable.inject(exports)
}
