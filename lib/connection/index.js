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
    queue: {
      value: []
    },
    send (data, queue) {
      if (this.clientState === 'DEQUEUING') {
        if (queue) {
          // this.internalClient[this.sendMethod](data)
        } else {
          // this.queue.push(data)
        }
      } else if (this.clientState !== 'READY') {
        // this.queue.push(data)
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
