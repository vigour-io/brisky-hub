'use strict'
var Hub = require('../../lib')
var cnt = 0
var Promise = require('bluebird')
var isNode = require('vigour-js/lib/util/is/node')
var indent = isNode ? '      ' : ''

exports.setup = function (params) {
  var protocol = params.protocol
  var key = params.key
  var receivers = params.receivers
  var log = params.log
  var id = params.id
  var result = {}
  var mock = key === 'mock'
  var connected = []
  var line

  if (!receivers) {
    receivers = 1
  }

  if (!id) {
    cnt++
    id = cnt
  }

  if (log) {
    var colors = require('colors-browserify') //eslint-disable-line
    line = console.line
    console.line = false
    console.log(
    (indent + 'hub test setup').blue.bold,
      '\n' + indent + 'protocol:', key,
      '\n' + indent + 'receivers:', receivers,
      '\n' + indent + 'id:', id
    )
    console.line = line
  }

  result.server = new Hub({
    key: 'server',
    adapter: {
      id: id + '_server',
      inject: protocol,
      [key]: {
        server: mock ? id + '_server' : 6001
      }
    }
  })

  normalReceivers(connected, result, id, protocol, key, mock, receivers, log, line)
  result.connected = Promise.all(connected)
  return result
}

exports.removed = function (val, data, event) {
  console.log('?!@#!@#!@#?')
  return data === null || val === null
}

function normalReceivers (connected, result, id, protocol, key, mock, receivers, log, line) {
  for (let i = 1; i < (receivers + 1); i++) {
    result[i] = new Hub({
      key: 'reciever' + i,
      adapter: {
        id: id + '_receiver_' + i,
        inject: protocol,
        [key]: mock ? id + '_server' : 'ws://localhost:6001'
      }
    })
    if (log) {
      result[i].adapter[key].connected.is(true, function () {
        console.line = false
        console.log((indent + 'connected').green.bold, this.parent.parent.parent.path.join('.'))
        console.line = line
      })
    }
    connected.push(result[i].adapter[key].connected.is(true))
  }
}
