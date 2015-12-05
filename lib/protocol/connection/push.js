'use strict'
// var Observable = require('vigour-js/lib/observable')

exports.on = {
  connect: {
    queue () {
      this.connected = true
      if (this.hasOwnProperty('queue') && this.queue) {
        for (let i in this.queue) {
          this.send(this.queue[i])
        }
        this.queue = null
      }
    }
  },
  close: {
    queue () {
      this.connected = false
    }
  }
}

exports.define = {
  push (payload) {
    if (!this.connected && this.upstream.val) {
      if (!this.hasOwnProperty('queue') || !this.queue) {
        this.queue = []
      }
      this.queue.push(payload)
    } else {
      this.send(payload)
    }
  }
}
// queing times
