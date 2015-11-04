'use strict'
var uuid = require('vigour-js/lib/util/uuid')
uuid.val = uuid.val + '_SERVER'
var server = require('./server')
server.adapter.listens.val = 3031
// require('./dev').randomUpdate(server)
require('./dev').startRepl()

var fs = require('fs')
server.pipe(fs.createWriteStream('resultlog.txt'))
// var http = require('http')
// http.createServer(function(req, res) {
//   server.pipe(res)
// }).listen(6060)
