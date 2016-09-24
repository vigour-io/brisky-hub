'use strict'
const subscribe = require('vigour-state/subscribe')
const serialize = require('./serialize')
const parse = require('./parse')
const vstamp = require('vigour-stamp')
const dummy = function () {}
const hash = require('quick-hash')

exports.define = {
  subscribe (subs, update, tree, stamp, client, id) {

    console.log('yo subscribe', subs)

    if (!update) { update = dummy }
    var hashed
    var added
    var clients
    if (client && client.isClient) {

      hashed = hash(JSON.stringify(subs))
      console.log(hashed)

      console.log(this.emitters.subscription && this.emitters.subscription.attach && this.emitters.subscription.attach.keys())


      // if (this.emitters.subscription && this.emitters.subscription.attach) {
      //   for (var i in this.emitters.subscription.attach.keys()) {
      //     var thing = this.emitters.subscription.attach[this.emitters.subscription.attach.keys()[i]]
      //     if (thing.hashed === hashed) {
      //       // console.log('HIT', thing[0].tree)
      //       // tree = thing[0].tree
      //       thing.clients.push(client)
      //       added = true
      //       break
      //     }
      //   }
      // }

      subs = parse(subs, this)

      // const hub = this
      // console.log('???', id)
      // id = hashed

      clients = [client]

      update = function (state, type, stamp, subs, tree, sType) {
        if (state.syncDown) {
          const stamp = state.stamp
          if (stamp) {
            const src = vstamp.src(stamp)
            if (client.key !== src) {
              // console.log(hub.clients.__c)
              // console.log(client.key, client.root.context, hub.context)
              // this is correct -- has to subscribe on different context needs to remove and re-add
              client.send(state, type, stamp, subs, tree, sType)
            }
          }
        }
      }

      // store on tree or something
      // update = function (state, type, stamp, subs, tree, sType) {
      //   if (state.syncDown) {
      //     const stamp = state.stamp
      //     if (stamp) {
      //       for (var i in clients) {
      //         doit(clients[i], state, type, stamp, subs, tree, sType)
      //       }
      //     }
      //   }
      // }

      function doit (client, state, type, stamp, subs, tree, sType) {
        const src = vstamp.src(stamp)
        if (client.key !== src) {
          // console.log(hub.clients.__c)
          // console.log(client.key, client.root.context, hub.context)
          // this is correct -- has to subscribe on different context needs to remove and re-add
          client.send(state, type, stamp, subs, tree, sType)
        }
      }

    }



    if (!added) {
      tree = subscribe(this, subs, update, tree, stamp, client, id)
    }

    if (!added && hashed) {
      this._emitters.subscription.attach[this._emitters.subscription._id].hashed = hashed
      this._emitters.subscription.attach[this._emitters.subscription._id].clients = clients
      // console.log('!!!', this._emitters.subscription._id)
    }

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
