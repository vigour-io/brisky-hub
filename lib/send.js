'use strict'

exports.define = {
  sendUpstream (data) {
    // decorate the data /w client id etc
    if (!this.connected.compute()) {
      // never queue as option
      if (!this.queue) { this.queue = [] }
      this.queue.push(data)
    } else {
      this.upstream.send(JSON.stringify(data))
    }
  }
}

exports.properties = {
  queue: true,
  connected: {
    type: 'observable',
    on: {
      data: {
        queue () {
          const hub = this.cParent()
          const queue = hub.queue
          if (queue) {
            for (let i = 0, len = queue.length; i < len; i++) {
              hub.upstream.send(JSON.stringify(queue[i]))
            }
            hub.queue = null
          }
        }
      }
    }
  }
}

exports.connected = false
