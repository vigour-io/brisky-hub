'use strict'
var Observable = require('vigour-js/lib/observable')
var SubsEmitter = require('vigour-js/lib/observable/subscribe/constructor')
var Protocol = require('../../protocol')

console.log('hey bitch')

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
  on (type) {
    console.log('-----'.green, arguments)
    var ret = Observable.prototype.on.apply(this, arguments)
    var base = ret || this
    if (typeof type === 'string') {
      if (base._on[type] instanceof SubsEmitter) {
        // need an event
        var Event = require('vigour-js/lib/event')
        var event = new Event(base, 'makeitsubs')
        base.sendUpstream(void 0, event, base._on[type].pattern)
        console.log('suc6'.rainbow)
      }
    }
    return ret
  }
}

exports.inject = require('./data')
