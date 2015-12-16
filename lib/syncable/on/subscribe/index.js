'use strict'
var Event = require('vigour-js/lib/event')
var hash = require('vigour-js/lib/util/hash')
var isEmpty = require('vigour-js/lib/util/is/empty')
var Observable = require('vigour-js/lib/observable')
var _subscribe = Observable.prototype.subscribe

exports.properties = {
  subsrefs: true,
  subscollectors: true
}

exports.define = {
  subscribe (pattern, fn, key, unique, event, nocnt) {
    // var add
    // NEEDS GAURD
    // if (!this._on[subs.key]) {
    //   add = true
    // }
    var subs = _subscribe.apply(this, arguments)
    // if (!dontadd) {
    this.sendSubscriptionUpstream(subs.pattern, void 0, subs.key, nocnt)
    // }
    return subs
  },
  unsubscribe (key, event) {
    console.log('dirt mc gurd 2', key)
    if (typeof key === 'string') {
      // this has to be handled better
      if (this.removeSubscription(key)) {
        console.log('LULZZZ')
        // let emitter = this._on && this._on[key]
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
  onSubRemove (emitter, event) {
    console.log('onSubRemove'.red)
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
  addSubscription (key, nocnt) {
    var newsub
    if (!this.hasOwnProperty('subscollectors')) {
      this.subscollectors = {}
    }
    if (!this.subscollectors[key]) {
      this.subscollectors[key] = 0
      newsub = true
    }
    if (!nocnt || newsub) {
      this.subscollectors[key]++
    }
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
  onSub (event, emitter, pattern) {
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
  sendSubscriptionUpstream (pattern, event, key, nocnt) {
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
    if (this.addSubscription(key, nocnt)) {
      this.sendUpstream(void 0, event, { [key]: { val: serialized, path: path } })
    }
    return key
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
