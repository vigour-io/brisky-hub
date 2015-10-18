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
var currentStatus = global.currentStatus = {
  '': uuid
}
var renderStatusInterval = 3000
var sinterval

// require('log-buffer')
// overwrite log make a small thin (nice and compact)

function toggleStatus (val) {
  if (val === void 0) {
    val = sinterval ? false : true
    // console.log('status updates:', val)
  }
  if (val) {
    if (!sinterval) {
      sinterval = setInterval(renderStatusProcess, renderStatusInterval)
    }
    let lines = process.stdout.getWindowSize()[1]
    for (let i = 0; i < lines; i++) {
      console.log('\r\n')
    }
    renderStatusProcess()
  } else if (val === false) {
    clearInterval(sinterval)
    sinterval = null
  }
}

function renderStatusProcess (args) {
  if (sinterval) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
  }
  if (args) {
    for (let i in args) {
      if (typeof args[i] === 'object') {
        let whitespace
        let check = typeof args[i - 1] === 'string' && args[i - 1]
        if (/^ +$/.test(check)) {
          whitespace = check
        }
        if (args[i].serialize) {
          args[i] = JSON.stringify(args[i].serialize(), false, 2)
        } else {
          args[i] = JSON.stringify(args[i], false, 2)
        }
        if (whitespace) {
          args[i] = args[i].split('\n').join('\n' + '  ' + whitespace)
        }
        args[i] = args[i].grey
      }
      process.stdout.write(args[i] + ' ')
    }
    process.stdout.write('\n')
  }
  if (sinterval) {
    process.stdout.cursorTo(0)
    let str = ''
    for (let i in currentStatus) {
      str += ' ' + i + ' ' + String(currentStatus[i]).green.bold
    }
    process.stdout.write(str)
  }
}

function status (payload) {
  merge(currentStatus, payload)
}

exports.startRepl = function () {
  if (isNode) {
    var repl = require('repl')
    var readable = new (require('stream')).Readable({
      read: function () {}
    })

    process.stdin.on('data', function (data) {
      var pusher = true
      if (data.length) {
        let shaved = data.slice(0, -1)
        let str = ''
        for (let i = 0 ; i < shaved.length; i++) {
          str += String.fromCharCode(shaved[i])
        }
        if (str === 's') {
          pusher = false
          toggleStatus()
        }
      }
      if (pusher) {
        toggleStatus(false)
        readable.push(data)
      }
    })

    repl.start({
      input: readable,
      output: process.stdout
    })
  }
}

global.status = status

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
  console.log = function () {
    renderStatusProcess(arguments)
  }
}

exports.data = function (data, event) {
  if (sinterval) {
    var isSelf = typeof event.stamp !== 'string' || event.stamp.indexOf(uuid) === 0
    var isUpstream = event.upstream
    console.log(
      '   ',
      this.path.join(' -> '),
      isSelf ? UPDATESELF : UPDATE,
      isUpstream ? UPSTREAM : isSelf ? '         ' : DOWNSTREAM,
      event.stamp,
      '\n', '     ', data
    )
  }
}

var cnt = 0
var time
exports.performance = function (data, event) {
  if (!time) {
    time = Date.now()
  }
  var sec = (Date.now() - time) / 1000
  status({ 'msg/s': ~~(cnt / sec), total: cnt })
  cnt++
}

exports.clients = function logClients (data, event) {
  console.log(
    '\n',
    'clients'
  )
  if (data) {
    if (data.added) {
      console.log((isNode ? ADDED.green : ADDED), data.added.join(', '))
    }
    if (data.removed) {
      console.log((isNode ? REMOVED.red : REMOVED), data.removed.join(', '))
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
    amount = 5000
  }
  for (let i = 0 ; i < 1; i++) {
    hub.set({
      val: uuid + ' ' + (updatecnt++)
      // field: uuid + ' ' + ~~(Math.random() * 99999) this will break it allready!
    })
  }
  // setTimeout(randUpdate, ~~(Math.random() * amount), hub, amount)
}

toggleStatus(true)
