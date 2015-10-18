'use strict'
var isNode = require('vjs/lib/util/is/node')
var uuid = String(require('vjs/lib/util/uuid').val)
var ADDED = '    added:'
var REMOVED = '    removed:'
var UPDATE = 'incoming '
var UPDATESELF = 'self'
var UPSTREAM = 'up  '
var DOWNSTREAM = 'down'
var merge = require('vjs/lib/util/merge')

var currentStatus = {
  '': uuid
}

function status (payload, method, args) {
  if (isNode) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    if (method) {
      method.apply(this, args)
    }
    merge(currentStatus, payload)
    let str = ''
    for (let i in currentStatus) {
      str += ' ' + i + ' ' + String(currentStatus[i]).green.bold
    }
    process.stdout.write(str)
  }
}

global.status = status

var log
if (isNode) {
  require('colors')
  let lines = process.stdout.getWindowSize()[1]
  for (let i = 0; i < lines; i++) {
    console.log('\r\n')
  }
  UPDATE = UPDATE.green
  UPDATESELF = UPDATESELF.grey
  UPSTREAM = UPSTREAM.magenta
  DOWNSTREAM = DOWNSTREAM.cyan
  log = console.log
  console.log = function () {
    status(false, log, arguments)
  }
}

exports.data = function (data, event) {
  // if(!isNode) console.clear()
  var isSelf = typeof event.stamp !== 'string' || event.stamp.indexOf(uuid) === 0
  var isUpstream = event.upstream
  console.log(
    '   ',
    this.path.join(' -> '),
    // isNode ? uuid.green.bold : uuid,
    isSelf ? UPDATESELF : UPDATE,
    isUpstream ? UPSTREAM : isSelf ? '         ' : DOWNSTREAM,
    event.stamp
  )
}

var cnt = 0
var time
function startPerf () {
  time = Date.now()
  setInterval(function () {
    var sec = (Date.now() - time) / 1000
    status({ 'msg/s': ~~(cnt / sec), total: cnt })
  }, 200)
}

exports.performance = function (data, event) {
  if (!time) {
    startPerf()
  }
  cnt++
}

exports.clients = function logClients (data, event) {
  console.log(
    '\n',
    'clients'
  )
  if (data) {
    if (data.added) {
      console.log((isNode ? ADDED.green : ADDED), data.added)
    }
    if (data.removed) {
      console.log((isNode ? REMOVED.red : REMOVED), data.removed)
    }
  }
  var client = this.parent.adapter.client && this.parent.adapter.client.val
  if (client) {
    status({ client: true })
  }
  var arr = this.map((property, key) => key)
  console.log('    clients:')

  // var str = '[ '
  for (let i in arr) {
    console.log('      ' +
    (arr[i] === client ? (isNode ? arr[i].green.bold : '>>>' + arr[i] + '<<<') : arr[i]))
  }
  status({ clients: arr.length })
  // str += ' ]'
}

// var timestamp = require('monotonic-timestamp')
var updatecnt = 0
exports.randomUpdate = function randUpdate (hub, amount) {
  if (amount === void 0) {
    amount = 3000
  }
  for (let i = 0 ; i < 100; i++) {
    hub.set({
      val: uuid + ' ' + (updatecnt++)
      // field: uuid + ' ' + ~~(Math.random() * 99999) this will break it allready!
    })
  }
  setTimeout(randUpdate, ~~(Math.random() * amount), hub, amount)
}
