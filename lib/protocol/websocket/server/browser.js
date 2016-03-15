'use strict'
exports.server = {
  on: {
    data: {
      server (data, event) {
        this.parent.parent.emit(
          'error',
          'websocket-server is not supported in the browser'
        )
      }
    }
  }
}
