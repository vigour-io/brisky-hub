'use strict'
const Sync = require('./sync')
const Client = require('./client')
const uuid = require('vigour-util/uuid').val

module.exports = new Sync({
  type: 'hub',
  define: { isHub: true },
  components: {
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
    subscriptions: true,
    contextId: true
    // different then up.context mostly used internal
    // case of different context to upstream when multiple hub
  },
  syncUp: false,
  syncDown: false
}, false).Constructor
