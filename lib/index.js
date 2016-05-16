'use strict'
const SyncState = require('./syncstate')
const server = require('./server')
const connect = require('./connect')

module.exports = function Hub (options) {
  console.log('lets go start hub', options)
  const hub = new SyncState()
  if (options.listen) {
    server(hub, options.listen)
  }
  if (options.connect) {
    connect(hub, options.connect)
  }
  return hub
}
