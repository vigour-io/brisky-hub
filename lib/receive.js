'use strict'
const vstamp = require('vigour-stamp')
exports.define = {
  receive (data) {
    console.log('RECIEVE', data, this.root.id)
    const hub = this
    hub.set({ incomingStamps: {} }, false)
    hub.set(data.state, false)
    for (let stamp in hub.incomingStamps) {
      vstamp.close(stamp)
    }
    hub.set({ incomingStamps: {} }, false)
  }
}
