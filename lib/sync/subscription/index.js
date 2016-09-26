'use strict'
const subscribe = require('vigour-state/subscribe')
const serialize = require('./serialize')
const parse = require('./parse')
const vstamp = require('vigour-stamp')
const dummy = () => {}

exports.define = {
  subscribe (subs, update, tree, stamp, client, id) {
    if (!update) { update = dummy }
    if (client && client.isClient) {
      subs = parse(subs, this)
      update = (state, type, stamp, subs, tree, sType) => {
        if (
          state.syncDown && (!state.syncDownIsFn || state.syncDown(state))
        ) {
          if (type !== 'remove' || state.val === null) {
            console.log('hello', state.path(), subs, state.inspect())
            const stamp = state.stamp
            if (stamp) {
              const src = vstamp.src(stamp)
              if (client.key !== src) {
                client.send(state, type, stamp, subs, tree, sType)
              }
            }
          } else {
            // really hard case --- need to check how to find out why something gets a remove
            // for switch is no real problem -- but for test if someone changes the title
            // have to send the title if its sended before else it does not remove
            // so for this we need to apply a reason
            // what about having val here in the update?
            console.log('ok what is the reason for remove?', state.stamp)
          }
        }
      }
    }

    // add re-use subscription (use same tree for same subs will handle this in state)
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
