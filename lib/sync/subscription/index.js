'use strict'
const subscribe = require('vigour-state/subscribe')
const serialize = require('./serialize')
const parse = require('./parse')
const send = require('./send')
const client = require('../../client/upstream')
const vstamp = require('vigour-stamp')
const dummy = function () {}

exports.define = {
  subscribe (subs, update, tree, stamp, attach, id) {
    if (!update) { update = dummy }
    if (attach && attach.isClient) {
      subs = parse(subs)
      update = function (state, type, stamp, subs, tree, sType) {
        if (state.syncDown) {
          const stamp = state.stamp
          if (stamp) {
            const src = vstamp.src(stamp)
            if (attach.key !== src) {
              send(attach, state, type, stamp, subs, tree, sType)
            }
          }
        }
      }
    }
    tree = subscribe(this, subs, update, tree, stamp, attach, id)
    if (!attach || !attach.isClient) {
      let hub = this.getRoot()
      let hubSubs = hub.subscriptions
      if (!hubSubs) { hubSubs = hub.subscriptions = {} }
      const path = this.realPath(false, true)
      if (path.length > 0) {
        console.log('need to resolve path -- do a bit later')
      } else {
        if (!id) { id = this._emitters.subscription._id }
        hubSubs[id] = serialize(this, subs)
      }
      client(hub)
    }

    return tree
  }
}
