'use stric'
// this emulates an internal like websocket
var Observable = require('vigour-js/lib/observable')
var Emitter = require('vigour-js/lib/emitter')
module.exports = new Observable({
  useVal: true,
  on: {
    properties: {
      // use ChildConstructor
      message: new Emitter({
        emitInstances: false,
        emitContexts: false
      }),
      close: new Emitter({
        emitInstances: false,
        emitContexts: false
      })
    }
  }
}).Constructor
