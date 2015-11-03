'use strict'
var Observable = require('vjs/lib/observable')

var Connection = new Observable({
  define: {
    RETRY_OPTIONS: {
      value: {
        MAX_TIMEOUT: 10000,
        TIMEOUT: 200,
        FACTOR: 1.2
      }
    },
    QUEUE_OPTIONS: {
      value: {
        DEQUEUE_SPEED: 500
      }
    },
    queue: {
      value: []
    },
    send: function (data) {
      if (this.clientState === 'DEQUEUING') {
        if (data.queue) {
          this.client[this.sendMethod](data.data)
        } else {
          this.queue.push({
            data: data.data ? data.data : data,
            queue: true})
        }
      } else if (this.clientState !== 'READY') {
        this.queue.push(data)
      } else {
        console.log('data', data, typeof data)
        this.client[this.sendMethod](data)
      }
    },
    reconnect: function () {
      this.clientState = 'CONNECTING'
      this.retryTimeout = this.retryTimeout
        ? this.retryTimeout * this.RETRY_OPTIONS.FACTOR
        : this.RETRY_OPTIONS.TIMEOUT
      this.retryCount += this.retryTimeout
      if (this.retryCount < this.RETRY_OPTIONS.MAX_TIMEOUT) {
        setTimeout(() => {
          this.connect()
        }, this.retryTimeout)
      }
    },
    onConnect: function () {
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
          this.send(data)
          // we need some delay before dequeuing, still don't know how much exactly
          setTimeout(() => {
            this.send({
              data: data.data ? data.data : data,
              queue: true
            })
            iter(this.queue.shift())
          }, this.QUEUE_OPTIONS.DEQUEUE_SPEED)
        }
        iter(this.queue.shift())
      }
    },
    onDisconnect: function () {
      this.clientState = 'NOT_OPENED'
    }
  }
})

module.exports = Connection.Constructor
