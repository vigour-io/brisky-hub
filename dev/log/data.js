'use strict'
var log = require('./')
var uuid = require('vigour-js/lib/util/uuid').val
var length = log.length
const UPDATE = 'incoming'.green
const UPDATESELF = 'self'.grey
const UPSTREAM = 'up  '.magenta
const DOWNSTREAM = 'down'.blue

exports.on = {
  data: {
    track (data, event) {
      log.line()
      dtrackunified.call(this, data, event)
    }
  },
  send: {
    track (data, event) {
      // if upstream -- how to get args
      // [data, this, toUpstream, output]
      dtrackunified.call(this, data[0], event, true, this.path, data[1], data[2], data[3], data[4])
    }
  }
}

function dtrackunified (data, event, outgoing, path, client, toUpstream, output, hub) {
  var isSelf = typeof event.stamp !== 'string' || event.stamp.indexOf(uuid) === 0
  var isUpstream = toUpstream || event.upstream
  var str = length(path && path.join('/') || this.path.join('/'), 30)
  var scope = length(this.lookUp('scope') || '*', 7)
  console.log(
    ' ',
    outgoing ? scope.yellow : scope.green,
    str,
    outgoing ? 'outgoing'.yellow : isSelf ? UPDATESELF : UPDATE,
    isUpstream ? UPSTREAM : isSelf ? '         ' : DOWNSTREAM,
    event.stamp,
    outgoing ? '\n           └> ' +
    (toUpstream
      ? hub && ('' + hub.adapter.val).bold.green
      : length(client.val, 25).blue + ' ' + length(client.scope || '*', 7).yellow
    ) + ' ' + JSON.stringify(output) + '\n'
    : ''
  )
}
// make an emit for on outgoing
