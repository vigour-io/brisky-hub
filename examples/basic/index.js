'use strict'
var uuid = require('vjs/lib/util/uuid')
uuid.val = uuid.val + '_SERVER'
var server = require('./server')
server.adapter.listens.val = 3031
// require('./dev').randomUpdate(server)
require('./dev').startRepl()

// var fs = require('fs')
// server.pipe(fs.createWriteStream(uuid.val + 'log.txt'))
