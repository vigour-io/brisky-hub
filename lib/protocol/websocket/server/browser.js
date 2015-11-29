'use strict'
console.log('reading browser field....')

exports.server = {
  on: {
    data: {
      server (data, event) {
        console.error('websocket-server is not supported in the browser', this.val)
      }
    }
  }
}
