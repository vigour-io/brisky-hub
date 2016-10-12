'use strict'
const vstamp = require('vigour-stamp')

// encapsulate more in here

exports.incoming = function offsetClient (hub, socket, data, clocksy, stamp) {
// (double offset) -- maybe dont use clocksy
  const tDelta = clocksy.processResponse(data.data)
  if (!stamp) {
    /*
      create stamp to set connected before updating offset, because changing
      offset might cause stamp to be earlier than existing stamp on hub.connected
    */
    stamp = vstamp.create('connect')
  }

  // this is not so nice, bit unclear -- dont want connected here
  if (socket.offset === void 0) {
    if (!vstamp.offsetConnection) {
      vstamp.offsetConnection = socket
    }
    socket.offset = tDelta
    // console.log(vstamp)
  } else {
    socket.offset = tDelta
  }
  if (vstamp.offsetConnection === socket) {
    vstamp.offset = Math.abs(tDelta) > 10 ? tDelta : 0
  }
  if (!hub.connected.compute()) {
    hub.set({ connected: true }, stamp)
    vstamp.close(stamp)
  }
}

// 'use strict'
// const vstamp = require('vigour-stamp')
//
// // encapsulate more in here
//
// exports.incoming = function offsetClient (hub, socket, data, clocksy, stamp) {
// // (double offset) -- maybe dont use clocksy
//   const tDelta = clocksy.processResponse(data.data)
//   const connecting = !hub.connected.compute()
//   const connectingStamp = connecting && vstamp.create('connect')
//
//   // this is not so nice, bit unclear -- dont want connected here
//   if (socket.offset === void 0) {
//     if (!vstamp.offsetConnection) {
//       vstamp.offsetConnection = socket
//     }
//     socket.offset = tDelta
//     // console.log(vstamp)
//   } else {
//     socket.offset = tDelta
//   }
//   if (vstamp.offsetConnection === socket) {
//     vstamp.offset = Math.abs(tDelta) > 10 ? tDelta : 0
//   }
//   if (connecting) {
//     hub.set({ connected: true }, connectingStamp)
//     connectingStamp && vstamp.close(connectingStamp)
//   }
// }
