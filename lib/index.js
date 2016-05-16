'use strict'
const SyncState = require('./syncstate')
const server = require('./server')
const connect = require('./connect')

const Hub = new SyncState({
  type: 'hub',
  inject: require('./send'),
  properties: {
    upstream: true,
    downstream: true
  }
}, false).Constructor

module.exports = function HubFn (options) {
  // will just become syncstate straight
  console.log('lets go start hub', options)
  const hub = new Hub()
  if (options.listen) {
    // port
    server(hub, options.listen)
  }
  // think of a good name here
  if (options.connect) {
    connect(hub, options.connect)
  }
  return hub
}
