'use strict'
const Sync = require('./sync')
const Client = require('./client')
const uuid = require('vigour-util/uuid').val
const ts = require('monotonic-timestamp')
const stamp = require('vigour-stamp')
const create = stamp.create
stamp.offset = 0 // dont worry too much about offset now
// not very beautifull but nessecary will be replaced later
stamp.create = (type, src, val) => create(type, src, val || ts() - stamp.offset)

module.exports = new Sync({
  type: 'hub',
  define: {
    isHub: true,
    inprogress: { value: {} }
  },
  types: {
    sync: Sync.prototype,
    client: Client.prototype
  },
  inject: [
    require('./clients'),
    require('./upstream'),
    require('./downstream'),
    require('./context'),
    require('./receive')
  ],
  properties: {
    incomingStamps: true,
    id: true,
    subscriptions: true
  },
  id: uuid, // make this stronger (do it later)
  syncUp: false,
  syncDown: false,
  on: {
    error (err) {
      // all errors go to root
      console.log(err)
    }
  }
}, false).Constructor
