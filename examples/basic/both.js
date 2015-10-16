var server = require('./server')
server.key = 'duplex'
// is a server and a client
server.adapter.listens.val = 3032
server.adapter.val = 'ws://localhost:3031'
