'use strict'
const subscribe = require('vigour-state/subscribe')
const serialize = require('./serialize')
const parse = require('./parse')
const vstamp = require('vigour-stamp')
const dummy = () => {}
const hash = require('quick-hash')

exports.define = {
  subscribe (subs, update, tree, stamp, client, id) {
    const hub = this.root

    if (client && client.isClient) {
      console.log(' INCOMING', hub.id, subs, id)
      if (!id) { throw new Error('NO ID ON INCOMING SUBS') }
      if (update) { throw new Error('UPDATE ON INCOMING FOR CLIENT WRONG!') }
      subs = parse(subs, hub)

      var clients
      update = hub.emitters.subscription && hub.emitters.subscription.fn[id]
      // need to remove subs that are NOT YOUR own

      if (!update) {
        console.log(' ', hub.id, 'add new', id)
        clients = [ client ]
        const _ = { clients }
        update = (state, type, subsStamp, subs, tree, sType) => {
          if (_.client) {
            execUpdate(_.client, state, type, subsStamp, subs)
          } else {
            for (let i = 0, len = clients.length; i < len; i++) {
              execUpdate(clients[i], state, type, subsStamp, subs)
            }
          }
        }
        tree = subscribe(this, subs, update, tree, stamp, void 0, id)
        tree._ = _
      } else {
        // for this one client need to resend everything -- do this smart
        // how to do this?
        // may need to do somehting in resubscribe
        console.log('allready exists', id)
        clients = update.tree._.clients
        clients.push(client)
        update.tree._.client = client
        this.clearTree(update.tree)
        update.call(this)
        delete update.tree._.client
      }

      client.on('remove', () => {
        console.log('remove it client', client.id.compute())
        for (let i = 0, len = clients.length; i < len; i++) {
          if (clients[i] === client) {
            clients.splice(i, 1)
            break
          }
        }
        if (clients.length === 0) {
          this.emitters.subscription.off(id) // need to be able to add fn here makes it faster
          console.log('remove subs', this.emitters.subscription.fn.keys())
        }
      }, id)
    } else {
      if (!update) { update = dummy }
      tree = subscribe(this, subs, update, tree, stamp, void 0, id)
    }

    if (!client || !client.isClient) {
      let hubSubs = hub.subscriptions
      if (!hubSubs) { hubSubs = hub.subscriptions = {} }
      const path = this.realPath(false, true)
      if (path.length > 0) {
        console.log('subs -- need to resolve path -- do a bit later -- deeper subs are currently not supported')
        // FIX THIS
      } else {
        const serialized = serialize(this, subs)
        if (!id) {
          id = hash(JSON.stringify(serialized))
        }
        hubSubs[id] = serialized
      }
      if (hub.client) { hub.client.origin().sendMeta() }
    }
    // tree re-use over multiple clients if they have the same subs
    // totally possible just hash the incoming
    return tree
  }
}

function execUpdate (client, state, type, subsStamp, subs) {
  if (state && (type !== 'remove' || state.val === null)) {
    const stamp = state.stamp
    if (stamp) {
      const src = vstamp.src(stamp)
      if (client.key !== src) {
        client.send(state, type, subsStamp, subs)
      }
    }
  }
}
