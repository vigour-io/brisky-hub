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
    id: { val: uuid }
  },
  sync: false
}, false).Constructor
