'use strict'
module.exports = function closeServer (server) {
  const connections = server.connections
  for (var i in connections) {
    connections[i].close()
  }
  // need to find all attached clients and remove
  // console.log(connections)
  server.httpServer.close()
}
