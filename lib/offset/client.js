'use strict'
const vstamp = require('vigour-stamp')

// encapsulate more in here

exports.incoming = function offsetClient (hub, socket, data, clocksy) {
// (double offset) -- maybe dont use clocksy
  const tDelta = clocksy.processResponse(data.data)

  // this is not so nice, bit unclear -- dont want connected here
  if (socket.offset === void 0) {
    if (!vstamp.offsetConnection) {
      vstamp.offsetConnection = socket
    }
    socket.offset = tDelta
    const stamp = vstamp.create('connect')
    // very bad spot for this...
    hub.set({ connected: true }, stamp)
    vstamp.close(stamp)
  } else {
    socket.offset = tDelta
  }
  if (vstamp.offsetConnection === socket) {
    vstamp.offset = Math.abs(tDelta) > 10 ? tDelta : 0
  }
}

// resolve clocks
