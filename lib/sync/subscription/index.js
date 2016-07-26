'use strict'
const subscribe = require('vigour-state/subscribe')
const serialize = require('./serialize')
const parse = require('./parse')
const send = require('./send')
const upstreamClient = require('../../upstream/client')
const upstreamSend = require('../../upstream/send')
const vstamp = require('vigour-stamp')
const dummy = function () {}

exports.define = {
  subscribe (subs, update, tree, stamp, attach, id) {
    if (!update) { update = dummy }
    if (attach && attach.isClient) {
      subs = parse(subs)
      update = function (state, type) {
        if (state.syncDown) {
          const stamp = state.stamp
          if (stamp) {
            const src = vstamp.src(stamp)
            if (attach.key !== src) {
              send(attach, state, stamp)
            }
          }
        }
      }
    }

    tree = subscribe(this, subs, update, tree, stamp || '0', attach, id)

    if (!attach || !attach.isClient) {
      let hub = this.getRoot()
      let hubSubs = hub.subscriptions
      if (!hubSubs) { hubSubs = hub.subscriptions = {} }
      const path = this.realPath(false, true)
      if (path.length > 0) {
        console.log('need to resolve path -- do a bit later')
      } else {
        if (!id) { id = this._emitters.subscription._id }
        hubSubs[id] = serialize(this, subs) // needs to parse the subs
      }
      if (hub.connected && hub.connected.compute() === true) {
        console.log('sending subs (allready connected')
        upstreamClient(hub)
        upstreamSend(hub)
      }
    }

    return tree
  }
}
