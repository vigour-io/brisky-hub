'use strict'
var isNode = require('vjs/lib/util/is/node')
var uuid = require('vjs/lib/util/uuid')
uuid = uuid.val = uuid.val + (isNode ? '_node_c_B' : '_browser_c_B')
var hub = require('./client')
hub.key = 'duplex_b'
setTimeout(() => hub.adapter.val = 3033, 1000)
require('./dev').startRepl()
require('./dev').randomUpdate(hub, 0)
// setTimeout(() => duplex.val = { x: Math.random() * 100 }, 1500)
