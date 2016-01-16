'use strict'
// move to adapter much better
var Event = require('vigour-js/lib/event')
var setByPath = require('vigour-js/lib/util/setwithpath')
// var Hub = require('../')
exports.define = {
  receiveSubscription (subscriptions, id, event) {
    var hub = this
    var client = hub.clients[id]

    // if (hub._scope) {
    //   console.log('xx====== SCOPE AND SUBS =====xxx')
    // }
    var ev = new Event('data')
    for (var field in subscriptions) {
      walk(subscriptions[field], field)
    }
    // ** ULTRA UBER EXTREME DIRT **
    // put all listeners on the original SCHMART!
    // make a totally special subs for hubs -- gonna be easy fast and reliable -- use map make it bundles
    // speed it up make it better, clean it up tests -- make old tests pass!
    // double connections multu upstream, cleaning up subs all things need to be done
    function resolvergetter (hub, field) {
      return hub._scope ? Object.getPrototypeOf(hub) : hub
    }
    // get client by id!
    function walk (subscription, field) {
      var reshub = resolvergetter(hub, subs)
      var reshub = hub
      var target
      if (field.indexOf('clients') > -1) {
        target = field === '$' ? reshub : reshub.get(field)
        if (!target) {
          return
        }
        return
      } else {
        target = field === '$' ? reshub : reshub.get(field, {})
      }
      for (var subs in subscription) {
        for (var type in subscription[subs]) {
          if (subs === '$') {
            subs = true
          }
          // if (target && target.key === 'clients') {
            // console.log('handle spesh!')
          // }
          if (type === 'property') {
            target.subscribe(subs, type, [ function (data, event, client) {
              if (client._input === null) {
                return
              }
              // console.log('yo its a propery!!!!', data)
              var datax = {}

              if (data && (data.removed || data.added)) {
                if (data && data.removed) {
                  // console.log('\n\n\n**************\n\n\nHERE\n\n\n*****************', data.removed)
                  for (let i in data.removed) {
                    datax[data.removed[i]] = null
                  }
                }
                if (data && data.added) {
                  for (let i in data.added) {
                    datax[data.added[i]] = {}
                  }
                }
              } else {
                this.each(function (p, key) {
                  datax[key] = {}
                })
              }

              var thing = {}
              setByPath(thing, this.path, datax)
              // so bad
              client.connection.origin.push({
                stamp: event.stamp,
                set: thing
              })
            }, client], id, true, ev)
          } else {
            // this is wrong unfortunately if (field.indexOf('clients') > -1) {
            target.subscribe(subs, type, [ function (data, event, client) {
              // var realdeal
              if (!client.parent || !client.parent.parent) {
                return
              }
              var scoped = client.parent.parent._scope
              if (((scoped && client.parent.parent._scope === this.lookUp('_scope')) || !scoped) || event === ev) {
                var realdeal = hub.get(this.path)
                data = realdeal ? realdeal._input : this
                client.send(realdeal || this, hub, data || data, event)
              }
            }, client ], id, true, ev)
          }
        }
      }
    }
    ev.trigger()
  }
}
