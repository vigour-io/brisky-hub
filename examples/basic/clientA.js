'use strict'
var isNode = require('vigour-js/lib/util/is/node')
var uuid = require('vigour-js/lib/util/uuid')
uuid = uuid.val = uuid.val + (isNode ? '_node_c_A' : '_browser_c_A')
var hub = require('./client')
hub.key = 'duplex_a'
setTimeout(() => hub.adapter.val = 3032, 1000)
require('./dev').startRepl()
// require('./dev').randomUpdate(hub, 0)
// setTimeout(() => duplex.val = { x: Math.random() * 100 }, 1500)
// var request = require('request')
// setTimeout(function() {
//
//   // request.get('http://img0.mxstatic.com/wallpapers/20ffe33ed6a16337f43a138205bba240_large.jpeg').pipe(hub.stream)
// },4000)
