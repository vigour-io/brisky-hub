'use strict'
var Observable = require('vjs/lib/observable')

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
      return _remove.call(this, event, nocontext, noparent)
    },
    send (observable, hub, data, event) {
      if (this.connection && data !== void 0 && this._input) {
        let stamp = event.stamp
        if (typeof stamp !== 'string') {
          stamp = uuid + '-' + stamp
        }
        let output = this.parse(observable, hub, data, event)
        if (output !== void 0) {
          // where my mofo context path bitchez
          // why does send gets called 2 times here? its very strange
          console.error('SEND!', output, this.path, observable._path)
          //has to be caught -- mayeb do ignore clients!
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
