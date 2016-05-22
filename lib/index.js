'use strict'
const Sync = require('./sync')
const Client = require('./client')
const uuid = require('vigour-util/uuid').val

module.exports = new Sync({
  type: 'hub',
  define: { isHub: true },
  types: {
    sync: Sync.prototype,
    client: Client.prototype
  },
  inject: [
    require('./clients'),
    require('./upstream'),
    require('./downstream')
  ],
  properties: {
    id: { val: uuid },
    subscriptions: true
  },
  syncUp: false,
  syncDown: false
}, false).Constructor
