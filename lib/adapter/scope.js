'use strict'

exports.scope = {
  on: {
    data: {
      scope (data, event) {
        // console.log('get instance from my upstream!', data, event)
        if (this.client && this.client.connection) {
          this.client.connection.send(JSON.stringify({
            scope: this.val,
            stamp: event.stamp
          }))
        } else {
          console.warn('no connection / client yet setting scope on adapter:', this.val, this.path)
        }
      }
    }
  }
}
