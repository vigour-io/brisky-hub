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
    off (key, val) {
      // hey what where the subscriptions for these boy?
      // hey unsubscribe!
      if (val && val.base) {
        if (this.subsrefs && this.subsrefs[val.base.uid]) {
          let path = this._path
          path.pop()
          this.sendUpstream(void 0, event, { unsubscribe: { val: this.subsrefs[val.base.uid], path: path } })
          let root = this.getRoot()

          if (root.subsmap) {
            for (let i in this.subsrefs[val.base.uid]) {
              console.log('!@#!@#', this.subsrefs[val.base.uid][i], root.subsmap)
              delete root.subsmap[this.subsrefs[val.base.uid][i]]
            }
          }
          delete this.subsrefs[val.base.uid]
          if (isEmpty(this.subsrefs)) {
            delete this.subsrefs
          }
        }
      }
      return Observable.prototype.off.apply(this, arguments)
    },
    on (type, attach) {
      var ret = Observable.prototype.on.apply(this, arguments)
      var base = ret || this

      console.log('log log log ON!', arguments)

      if (typeof type === 'string') {

        console.log('DO DO DO IT!', type, this._path.join('.').blue.bold, attach)
        // where is the subs listener????

        if (base._on && base._on[type] instanceof SubsEmitter) {
          console.log('DIRECT SUBSCRIPTION --- also needs to get added to shit -- also needs unsubscribe hook (in unsubscribe)')
          sendSubsUp(base, base._on[type].pattern, type)
        } else if (type !== 'remove' && type !== 'reference' && attach && attach[1] instanceof SubsEmitter) {
          var parent = attach && attach[1]._parent

          while (parent) {
            if (parent instanceof Syncable) {
              console.error('WRONG! subscribed directly to synacable! with a ref not nessecary handled line 76')
              return ret
            }
            parent = parent._parent
          }

          let root = this.getRoot()
          let subsemitter = attach[1]
          let genpath = subsemitter._path.join('.')   //subsemitter._parent.uid

          // only use path up until the reference!

          // console.log()

          if (root.subsmap && root.subsmap[genpath]) {
            console.log('! NO!!!')
            return ret
          }

          let p = subsemitter
          // while (p) {
          //   console.log('parent keys!!!!:', p.key)
          //   p = p.parent
          // }


          console.log('SUBS!'.green, genpath, JSON.stringify(root.subsmap), root.subsmap && root.subsmap[genpath])
          if (!root.susbsmap) {
            root.subsmap = {}
          }
          root.subsmap[genpath] = true

          let hashed = sendSubsUp(base, attach[2][1].parent)
          let reference = attach[2][attach[2].length-1]
          console.log('------------>',  this._path)
          if (reference) {

            // reference.

            console.log('GOT REFERENCE!!!!! lulzzzz'.rainbow, reference, hashed)
            if (!reference._input.hasOwnProperty('subsrefs')) {
              console.log('make new')
              reference._input.subsrefs = {}
            }
            if (!reference._input.subsrefs[reference.uid]) {
              console.log('make it now new')
              reference._input.subsrefs[reference.uid] = {}
            }

            // paths waarop de listeners hangen
            reference._input.subsrefs[reference.uid][hashed] = genpath
            console.log(JSON.stringify(this.subsrefs, false, 2))
          }
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
