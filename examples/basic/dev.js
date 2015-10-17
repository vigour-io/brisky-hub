'use strict'
var isNode = require('vjs/lib/util/is/node')
if (isNode) {
  require('colors')
  var lines = process.stdout.getWindowSize()[1]
  for (var i = 0; i < lines; i++) {
    console.log('\r\n')
  }
}
var uuid = require('vjs/lib/util/uuid').val

var ADDED = '    added:'
var REMOVED = '    removed:'
var UPDATE = 'incoming '
var UPDATESELF = 'self     '
var UPSTREAM = 'upstream  '
var DOWNSTREAM = 'downstream'
if (isNode) {
  UPDATE = UPDATE.green
  UPDATESELF = UPDATESELF.grey
  UPSTREAM = UPSTREAM.magenta
  DOWNSTREAM = DOWNSTREAM.magenta
}

exports.data = function (data, event) {
  // if(!isNode) console.clear()
  var isSelf = event.stamp.indexOf(uuid) === 0
  var isUpstream = event.upstream
  console.log('   ',
    this.path.join(' -> '),
    isNode ? uuid.green.bold : uuid,
    isSelf ? UPDATESELF : UPDATE,
    isUpstream ? UPSTREAM : isSelf ? '          ' : DOWNSTREAM,
    event.stamp
  )
}

exports.clients = function logClients (data, event) {
  console.log(
    '\n',
    (isNode ? uuid.green.bold : uuid),
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
    console.log('    hasClient:', true)
  }
  var arr = this.map((property, key) => key)
  var str = '[ '
  for (let i in arr) {
    str += ((i == 0 ? '' : ', ') +
    (arr[i] === client ? (isNode ? arr[i].green.bold : '>>>' + arr[i] + '<<<') : arr[i]))
  }
  str += ' ]'
  console.log('    clients:', str)
}

exports.randomUpdate = function randUpdate (hub) {
  hub.set({
    val: uuid + ' ' + ~~(Math.random() * 99999)
    // field: uuid + ' ' + ~~(Math.random() * 99999) this will break it allready!
  })
  setTimeout(randUpdate, Math.random() * 0, hub)
}
