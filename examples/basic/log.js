'use strict'
var isNode = require('vjs/lib/util/is/node')
if (isNode) {
  require('colors')
}
var uuid = require('vjs/lib/util/uuid').val

const ADDED = '    added:'
const REMOVED = '    removed:'

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
