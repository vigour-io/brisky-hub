'use strict'
var uuid = require('vjs/lib/util/uuid')
uuid.val = uuid.val + '_SERVER'
var server = require('./server')
server.adapter.listens.val = 3031

// require('./dev').randomUpdate(server)
global.hub = server

require('./dev').startRepl()


var fs = require('fs')
// server.pipe(process.stdout)

//.val
