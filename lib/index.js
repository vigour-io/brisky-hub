'use strict'
const SyncState = require('./syncstate')

module.exports = new SyncState({
  type: 'hub',
  properties: {
    upstream: true,
    downstream: true,
    url: {
      type: 'observable'
    },
    port: {
      type: 'observable'
    }
  }
}, false).Constructor
