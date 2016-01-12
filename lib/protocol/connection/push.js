'use strict'

exports.on = {
  connect: {
    queue () {
      this.connected = true
      // connected --- fire way way way too late
      if (this.hasOwnProperty('queue') && this.queue) {
        // console.error('--->',)
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

// make 2 one server side connection
exports.define = {
  push (payload) {
    if (!this.connected && this.upstream._input) {
      console.log('ok have to put this one in a queue (???)')
      if (!this.hasOwnProperty('queue') || !this.queue) {
        this.queue = []
      }
      this.queue.push(payload)
    } else {
      this.send(payload)
    }
  }
}
