'use strict'
const vstamp = require('vigour-stamp')
exports.define = {
  receive (data) {
    const hub = this
    hub.set({ loop: {} }, false)
    hub.set(data.state, false)
    for (var i in hub.loop) {
      vstamp.close(i)
    }
    // loop is not a good name
    hub.set({ loop: {} }, false)
  }
}
