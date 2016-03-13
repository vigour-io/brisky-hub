'use strict'
// this emulates an internal like websocket
var Observable = require('vigour-observable')
var Emitter = require('vigour-observable/lib/emitter')
module.exports = new Observable({
  useVal: true,
  on: {
    ChildConstructor: new Emitter({
      emitInstances: false,
      emitContexts: false
    })
  }
}).Constructor
