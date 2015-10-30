'use strict'
var EventEmitter = require('events')
var Queue = require('js-structures').Queue

const CLIENT_STATES = {
  NOT_OPENED: 0,
  CONNECTING: 1,
  READY: 2
}

const SERVER_STATES = {
  NOT_OPENED: 0,
  LISTENING: 1
}

// TODO: make it configurable
const RETRY_OPTIONS = {
  MAX_TIMEOUT: 1000000,
  TIMEOUT: 50,
  FACTOR: 1.5
}

module.exports.CLIENT_STATES = CLIENT_STATES
module.exports.SERVER_STATES = SERVER_STATES

class Connection extends EventEmitter {
  constructor (type) {
    // EventEmitter
    super()
    this.type = type
    this.queue = []
    this.retry_max_timeout = RETRY_OPTIONS.MAX_TIMEOUT
    this.client_state = CLIENT_STATES.NOT_OPENED
    this.server_state = SERVER_STATES.NOT_OPENED
  }
  reconnect () {
    console.log('--- RECONNECT')
    this.client_state = CLIENT_STATES.CONNECTING
    this.retry_timeout = this.retry_timeout ?
      this.retry_timeout * RETRY_OPTIONS.FACTOR : RETRY_OPTIONS.FACTOR
    console.log('--timeout', this.retry_timeout)
    this.retry_max_timeout -= this.retry_timeout
    if (this.retry_max_timeout > 0) {
      setTimeout(() => {
        this.retry_count++
        console.log(this.connectArgs)
        this.connect()
      }, this.retry_timeout)
    }
  }
  send (data) {
    if (this.client_state !== CLIENT_STATES.READY) {
      this.queue.push(data)
    } else {
      this.client[this.client_send_method](data)
    }
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
    delete this.retry_timeout
    if (this.queue.length) {
      while (this.queue.length) {
        this.send(this.queue.shift())
      }
    }
  }
  onData (data) {
    this.emit('data', data)
  }
}

module.exports.Connection = Connection
