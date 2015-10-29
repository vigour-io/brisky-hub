'use strict'
var EventEmitter = require('events')

var CLIENT_STATES = {
  NOT_OPENED: 0,
  CONNECTING: 1,
  READY: 2
}

var SERVER_STATES = {
  NOT_OPENED: 0,
  LISTENING: 1
}

Object.freeze(CLIENT_STATES)
Object.freeze(SERVER_STATES)

module.exports.CLIENT_STATES = CLIENT_STATES
module.exports.SERVER_STATES = SERVER_STATES

class Connection extends EventEmitter {
  constructor (type) {
    // EventEmitter
    super()
    this.type = type
    this.client_state = CLIENT_STATES.NOT_OPENED
    this.server_state = SERVER_STATES.NOT_OPENED
  }
  send (data) {
    this.client_send
  }
  onListening () {
    this.emit('listens', 'http server waiting for connections')
    this.server_state = SERVER_STATES.LISTENING
  }
  onError (err) {
    this.emit('error', err)
  }
  onConnect () {
    this.client_state = CLIENT_STATES.READY
  }
  onData (data) {
    this.emit('data', data)
  }
}

module.exports.Connection = Connection
