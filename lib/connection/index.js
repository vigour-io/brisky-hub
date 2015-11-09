'use strict'
var Observable = require('vigour-js/lib/observable')
var Connection = new Observable({
  retryMaxTimeout: 10000,
  retryStartTimeout: 200,
  retryFactor: 1.2,
  dequeuingSpeed: 500,
  properties: {
    client: true,
    connClient: true,
    sendMethod: true
  },
  define: {
    // I think this is all observable instead of definitions,
    // now its pretty static and does not inherit stuff like normal in a base
    RETRY_OPTIONS: {
      value: {
        MAX_TIMEOUT: 1000,
        TIMEOUT: 10,
        FACTOR: 1.2
      }
    },
    QUEUE_OPTIONS: {
      value: {
        DEQUEUE_SPEED: 10
      }
    },
    queue: {
      value: []
    },
    send (data, queue) {
      // queue is rly broken
      if (this.clientState === 'DEQUEUING') {
        console.log('!QUEUE') // this needs to become smarter e.g. a merge
        if (queue) {
          this.internalClient[this.sendMethod](data)
        } else {
          this.queue.push(data)
        }
      } else if (this.clientState !== 'READY') {
        this.queue.push(data)
      } else {
        this.internalClient[this.sendMethod](data)
      }
    },
    reconnect () {
      this.clientState = 'CONNECTING'
      this.retryTimeout = this.retryTimeout
        ? this.retryTimeout * this.retryFactor.val
        : this.retryStartTimeout.val
      this.retryCount = isNaN(this.retryCount)
        ? 0
        : this.retryCount += this.retryTimeout
      if (this.retryCount < this.retryMaxTimeout.val) {
        setTimeout(() => {
          this.connect()
        }, this.retryTimeout)
      } else {
        this.remove()
      }
    },
    onConnect () {
      // this can be wrapped in the on: { } object of observable (emit connect)
      this.clientState = 'READY'
      this.retryTimeout = null
      this.retryCount = 0
      if (this.queue.length) {
        let iter = (data) => {
          if (!data) {
            this.clientState = 'READY'
            return
          }
          this.clientState = 'DEQUEUING'
          this.send(data, true)
          // we need some delay before dequeuing, still don't know how much exactly
          setTimeout(() => {
            this.send(data, true)
            iter(this.queue.shift())
          }, this.dequeuingSpeed)
        }
        iter(this.queue.shift())
      }
    },
    onDisconnect () {
      this.clientState = 'NOT_OPENED'
    }
  }
})

module.exports = Connection.Constructor
