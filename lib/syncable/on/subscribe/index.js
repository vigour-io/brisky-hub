'use strict'
var Event = require('vigour-js/lib/event')
var hash = require('vigour-js/lib/util/hash')
var isEmpty = require('vigour-js/lib/util/is/empty')
var Observable = require('vigour-js/lib/observable')
var _subscribe = Observable.prototype.subscribe
var listener = require('./listener')

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
  receiveSubscription (subscribe, client, hashed) {
    if (subscribe) {
      let target = (subscribe.path && subscribe.path.length ? this.get(subscribe.path, {}) : this)
      console.log('subscribing on:', subscribe.val, target.syncPath)
      var sub = target.subscribe(subscribe.val, [listener, client], client.key, true, void 0, true)
      sub.onRemoveProperty = function () {
        console.log('yo yo yo REMOVE MY UBSUBSCRIPTION AND THIS SUBSCRIPTION'.rainbow, target.path)
        target.unsubscribe(sub.key)
      }
      sub.run()
    }
  },
  onSub (event, emitter, pattern) {
    var genpath = emitter.path.join('.')
    console.log('onSub'.magenta.inverse, genpath, this.path.join('.'), this.subsrefs)

    if (this.subsrefs && this.subsrefs[genpath]) {
      console.log('allready have!'.magenta.inverse, genpath)

      return
    }
    if (!this.hasOwnProperty('subsrefs')) {
      this.subsrefs = {}
    }
    let key = this.sendSubscriptionUpstream(pattern, event)
    console.log('yo yo yo!')
    this.subsrefs[genpath] = key
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
      console.log(hashed)
      this.unsubscribe(hashed, event)
    }
  },
  addSubscription (key, nocnt) {
    console.log('yo add!', key)
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
      console.log('YO!', key, this.subscollectors[key])
      if (!this.subscollectors[key]) {
        delete this.subscollectors[key]
        if (isEmpty(this.subscollectors)) {
          delete this.subscollectors
        }
        return true
      }
    }
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
