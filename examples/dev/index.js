'use strict'
require('colors')
var isNode = require('vigour-js/lib/util/is/node')
var uuid = String(require('vigour-js/lib/util/uuid').val)
// var isPlainObj = require('vigour-js/lib/util/is/plainobj')
// var ADDED = '    added:'
// var REMOVED = '    removed:'
var UPDATE = 'incoming'
var UPDATESELF = 'self'
var UPSTREAM = 'up  '
var DOWNSTREAM = 'down'

if (isNode) {
  console.clear = function () {
    let lines = process.stdout.getWindowSize()[1]
    for (let i = 0; i < lines; i++) {
      console.log('\r\n')
    }
  }
  UPDATE = UPDATE.green
  UPDATESELF = UPDATESELF.grey
  UPSTREAM = UPSTREAM.magenta
  DOWNSTREAM = DOWNSTREAM.cyan
}

var dtrack = function (data, event) {
  var cols = process.stdout.columns
  var line = ''
  cols = cols - line.length
  while (cols) {
    cols--
    line = '_' + line
  }
  console.log(line.grey, '\n')
  dtrackunified.call(this, data, event)
}

global.outgoingTrack = function (output, data, event, hub, toUpstream, path) {
  dtrackunified.call(hub, data, event, this, path, this, toUpstream, output)
}

exports.on = {
  // property (data) {
  //   if(data.added) {
  //
  //   }
  //   console.log('property '.bold.green, ADDED, data.added, REMOVED, data.removed)
  // },
  data: dtrack
}

function dtrackunified (data, event, outgoing, path, client, toUpstream, output) {
  var isSelf = typeof event.stamp !== 'string' || event.stamp.indexOf(uuid) === 0
  var isUpstream = toUpstream || event.upstream
  var str = shave(path && path.join('/') || this.path.join('/'), 30)
  var scope = shave(this.lookUp('scope') || '*', 7)
  console.log(
    ' ',
    outgoing ? scope.yellow : scope.green,
    str,
    outgoing ? 'outgoing'.yellow : isSelf ? UPDATESELF : UPDATE,
    isUpstream ? UPSTREAM : isSelf ? '         ' : DOWNSTREAM,
    event.stamp,
    outgoing ? '\n           └> ' +
    (toUpstream
      ? this.adapter && ('' + this.adapter.val).bold.green
      : shave(client.val, 25).blue + ' ' + shave(client.scope || '*', 7).yellow
    ) + ' ' + JSON.stringify(output) + '\n'
    : ''
  )
}

function shave (str, len) {
  if (!str.length || str.length < Math.abs(len)) {
    for (var i = str.length; i < Math.abs(len); i++) {
      str += ' '
    }
  } else if (str.length > Math.abs(len)) {
    if (len < 0) {
      str = str.slice(0, (Math.abs(len) - 3)) + '...'
    } else {
      str = '...' + str.slice(-(len - 3))
    }
  }
  return str
}
