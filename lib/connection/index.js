'use strict'
var EventEmitter = require('events')

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
  MAX_TIMEOUT: 10000,
  TIMEOUT: 200,
  FACTOR: 1.2
}

module.exports.CLIENT_STATES = CLIENT_STATES
module.exports.SERVER_STATES = SERVER_STATES

class Connection extends EventEmitter {
  constructor (type) {
    // EventEmitter
    super()
    this.type = type
    this.queue = []
    this.retry_count = 0
    this.client_state = CLIENT_STATES.NOT_OPENED
    this.server_state = SERVER_STATES.NOT_OPENED
  }
  reconnect () {
    this.client_state = CLIENT_STATES.CONNECTING
    this.retry_timeout = this.retry_timeout
      ? this.retry_timeout * RETRY_OPTIONS.FACTOR
      : RETRY_OPTIONS.TIMEOUT
    this.retry_count += this.retry_timeout
    if (this.retry_count < RETRY_OPTIONS.MAX_TIMEOUT) {
      setTimeout(() => {
        this.connect()
      }, this.retry_timeout)
    }
  }
  send (data) {
    // console.log('-- SEND')
    if (this.client_state !== CLIENT_STATES.READY) {
      // console.log('queuing', data)
      this.queue.push(data)
    } else {
      // console.log('sending', data)
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
    this.retry_count = 0
    // console.log('-- ONCONNECT')
    // console.log(this.queue)
    for (let data = this.queue.shift(); data ;) {
      // console.log('dequeuing', data)
      this.send(data)
      data = this.queue.shift()
    }
  }
  onData (data) {
    this.emit('data', data)
  }
  onDisconnect () {
    this.client_state = CLIENT_STATES.NOT_OPENED
  }
}

module.exports.Connection = Connection
