'use strict'
var EventEmitter = require('events')
/* statuses */
// TODO: remove constants
const CLIENT_STATES = {
  NOT_OPENED: 0,
  CONNECTING: 1,
  DEQUEUING: 2,
  READY: 3
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
// TODO: make it configurable
const QUEUE_OPTIONS = {
  DEQUEUE_SPEED: 500
}

module.exports.CLIENT_STATES = CLIENT_STATES
module.exports.SERVER_STATES = SERVER_STATES

class Connection extends EventEmitter {
  constructor (type) {
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
    if (this.client_state === CLIENT_STATES.DEQUEUING) {
      if (data.queue) {
        this.client[this.client_send_method](data.data)
      } else {
        this.queue.push({
          data: data.data ? data.data : data,
          queue: true})
      }
    } else if (this.client_state !== CLIENT_STATES.READY) {
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
    this.retry_timeout = null
    this.retry_count = 0
    if (this.queue.length) {
      let iter = (data) => {
        // console.log('4.', typeof data, data)
        if (!data) {
          this.client_state = CLIENT_STATES.READY
          return
        }
        this.client_state = CLIENT_STATES.DEQUEUING
        this.send(data)
        // we need some delay before dequeuing, still don't know how much exactly
        setTimeout(() => {
          this.send({
            data: data.data ? data.data : data,
            queue: true
          })
          iter(this.queue.shift())
        }, QUEUE_OPTIONS.DEQUEUE_SPEED)
      }
      iter(this.queue.shift())
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
