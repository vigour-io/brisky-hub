var uuid = require('vjs/lib/util/uuid')
uuid.val = uuid.val + '_server'
var server = require('./server')
server.adapter.listens.val = 3031

require('./dev').randomUpdate(server)
