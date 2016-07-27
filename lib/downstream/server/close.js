'use strict'
module.exports = function closeServer (server) {
  // this will go with clients
  const connections = server.connections
  for (var i in connections) {
    connections[i].close()
  }
  server.httpServer.close()
}
