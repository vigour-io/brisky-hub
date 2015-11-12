'use strict'

exports.server = {
  on: {
    data: {
      server (val, event) {
        this.parent.mockServers[val] = this
        console.log('start server!', val)
      }
    }
  }
}
