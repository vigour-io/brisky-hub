'use strict'
var Hub = require('../../lib')
var cnt = 0
var Promise = require('bluebird')

exports.setup = function (protocol, key, receivers, id) {
  // make this a resuseable function
  var result = {}
  var mock = key === 'mock'
  var connected = []

  if (!receivers) {
    receivers = 1
  }

  if (!id) {
    cnt++
    id = cnt
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

  for (let i = 1; i < (receivers + 1); i++) {
    result[i] = new Hub({
      key: 'reciever' + i,
      adapter: {
        id: id + 'receiver' + i,
        inject: protocol,
        [key]: mock ? id + '_server' : 'ws://localhost:6001'
      }
    })
    console.log(result[i].adapter[key].connected)
    connected.push(result[i].adapter[key].connected.is(true))
  }

  result.connected = Promise.all(connected)
  return result
}
