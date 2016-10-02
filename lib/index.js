'use strict'
const Sync = require('./sync')
const Client = require('./client')
const uuid = require('vigour-util/uuid').val // uuid util
const ts = require('monotonic-timestamp')
const stamp = require('vigour-stamp')
const create = stamp.create
stamp.offset = 0 // dont worry too much about offset now
// not very beautifull but nessecary will be replaced later
stamp.create = (type, src, val) => create(type, src, val || ts() - stamp.offset)

// const debug = require('vigour-stamp/debug')
// debug(stamp)
// var cr = stamp.create
// stamp.create = (type, src, val) => {
//   const s = cr.call(this, type, src, val)
//   console.log('CREATE', s)
//   return s
// }
// var x = stamp.close
// stamp.close = (s) => {
//   console.log('CLOSE', s)
//   return x.call(this, s)
// }
console.log('hello')
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
  id: uuid,
  on: {
    error (err) {
      console.log('ERROR', err)
    }
  }
}, false).Constructor
