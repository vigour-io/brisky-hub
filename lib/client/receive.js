'use strict'
const vstamp = require('vigour-state')
exports.define = {
  receive (data) {
    const hub = this.root
    hub.set({ loop: {} }, false)
    hub.set(data.state, false)
    for (var i in hub.loop) {
      vstamp.close(i)
    }
    // loop is not a good name
    hub.set({ loop: {} }, false)
  }
}
