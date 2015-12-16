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
    console.log('PUSH!', payload, this.connected, this.upstream.val)
    // queue length!
    if (!this.connected && this.upstream._input) {
      // console.log('queue it', payload)
      if (!this.hasOwnProperty('queue') || !this.queue) {
        this.queue = []
      }
      // console.log('---> (up) queue', payload)
      this.queue.push(payload)
    } else {
      // console.log('---> send', payload)
      this.send(payload)
    }
  }
}
// queing times
