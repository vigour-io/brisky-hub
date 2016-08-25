'use strict'
const subscribe = require('vigour-state/subscribe')
const serialize = require('./serialize')
const parse = require('./parse')
const vstamp = require('vigour-stamp')
const dummy = function () {}

exports.define = {
  subscribe (subs, update, tree, stamp, client, id) {
    if (!update) { update = dummy }
    if (client && client.isClient) {
      subs = parse(subs)
      update = function (state, type, stamp, subs, tree, sType) {
        console.log(state.root.id, client.key)
        if (state.syncDown) {
          console.log('further')
          const stamp = state.stamp
          if (stamp) {
            const src = vstamp.src(stamp)
            if (client.key !== src) {
              client.send(state, type, stamp, subs, tree, sType)
            }
          }
        }
      }
    }
    tree = subscribe(this, subs, update, tree, stamp, client, id)
    if (!client || !client.isClient) {
      let hub = this.root
      let hubSubs = hub.subscriptions
      if (!hubSubs) { hubSubs = hub.subscriptions = {} }
      const path = this.realPath(false, true)
      if (path.length > 0) {
        console.log('subs -- need to resolve path -- do a bit later')
      } else {
        if (!id) { id = this._emitters.subscription._id }
        hubSubs[id] = serialize(this, subs)
      }
      hub.client.origin().sendMeta()
    }
    // tree re-use over multiple clients if they have the same subs
    // totally possible just hash the incoming
    return tree
  }
}
