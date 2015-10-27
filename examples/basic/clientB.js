'use strict'
var isNode = require('vjs/lib/util/is/node')
var uuid = require('vjs/lib/util/uuid')
uuid = uuid.val = uuid.val + (isNode ? '_node_c_B' : '_browser_c_B')
var hub = require('./client')
hub.key = 'duplex_b'
setTimeout(() => hub.adapter.val = 3033, 1000)
require('./dev').startRepl()
// require('./dev').randomUpdate(hub, 0)
// setTimeout(() => duplex.val = { x: Math.random() * 100 }, 1500)
// var stream = fs.createReadStream(__dirname + '/a.mov')
global.mb = 0
var cnt = 0
var fs = require('fs')
setTimeout(function () {
  global.streamin = Date.now()
  // var stream = fs.createReadStream(__dirname + '/a.mov')

  // hub.set(fs.createReadStream(__dirname + '/a.mov'))

  var stream = fs.createReadStream('./a.mov')

  // hub.val =
  stream.on('data', function (data) {
    cnt++
    currentStatus.cnt = cnt
    hub.val = data.toString()
    // hub.setKey(cnt, data.toString())
    global.mb += ((data && data.toString().length) / 1024 / 1024)
    currentStatus['mb/s'] = ~~(global.mb / ((Date.now() - global.streamin) / 10000)) / 10
  })

  stream.on('end', function() {
    console.log('done!', ((Date.now() - global.streamin)/1000) + 's' , global.mb, 'mb')
  })
}, 1000)

// request.get('http://img0.mxstatic.com/wallpapers/20ffe33ed6a16337f43a138205bba240_large.jpeg').pipe(hub.stream)
