'use strict'
var Observable = require('vigour-js/lib/observable')

var Connection = new Observable({
  properties: {
    client: true,
    internalClient: true
  },
  define: {
    // I think this is all observable instead of definitions,
    // now its pretty static and does not inherit stuff like normal in a base
    RETRY_OPTIONS: {
      value: {
        MAX_TIMEOUT: 10000,
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
        console.log('!QUEUE')
        if (queue) {
          this.internalClient[this.sendMethod](data)
        } else {
          this.queue.push(data)
        }
      } else if (this.clientState !== 'READY') {
        this.queue.push(data)
      } else {
        console.log('ok')
        this.internalClient[this.sendMethod](data)
      }
    },
    reconnect () {
      this.clientState = 'CONNECTING'
      this.retryTimeout = this.retryTimeout
        ? this.retryTimeout * this.RETRY_OPTIONS.FACTOR
        : this.RETRY_OPTIONS.TIMEOUT
      this.retryCount = this.retryCount
        ? this.retryCount += this.retryTimeout
        : 0
      if (this.retryCount < this.RETRY_OPTIONS.MAX_TIMEOUT) {
        setTimeout(() => {
          this.connect()
        }, this.retryTimeout)
      }
    },
    onConnect () {
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
          }, this.QUEUE_OPTIONS.DEQUEUE_SPEED)
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
