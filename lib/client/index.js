'use strict'
var Observable = require('../observable')
var _remove = Observable.prototype.remove
var uuid = require('vjs/lib/util/uuid').val
module.exports = new Observable({
  properties: {
    connection: true
  },
  inject: require('./parse'),
  define: {
    remove (event, nocontext, noparent) {
      // need to remove all refs to client!!!
      console.log('removes!')
      return _remove.call(this, event, nocontext, noparent)
    },
    send (observable, hub, data, event) {
      if (this.connection && data !== void 0) {
        let stamp = event.stamp
        if (typeof stamp !== 'string') {
          stamp = uuid + '-' + stamp
        }
        let output = this.parse(observable, hub, data, event)
        if (output !== void 0) {
          // where my mofo context path bitchez
          console.error('SEND!', output, hub.path)
          this.connection.send(JSON.stringify({
            set: output,
            stamp: stamp
          }))
        }
      }
    }
  },
  ChildConstructor: 'Constructor'
}).Constructor
