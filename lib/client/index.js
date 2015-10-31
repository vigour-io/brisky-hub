'use strict'
// var Observable = require('vjs/lib/observable')

var Observable = require('../observable')

var _remove = Observable.prototype.remove
var uuid = require('vjs/lib/util/uuid').val
module.exports = new Observable({
  properties: {
    connection: true,
    instance: true
  },
  inject: require('./parse'),
  define: {
    remove (event, nocontext, noparent) {
      // need to remove all refs to client!!!
      return _remove.call(this, event, nocontext, noparent)
    },
    send (observable, hub, data, event) {
      // console.log('sending it')
      if (hub.instance || this.instance) {
        if (this.instance && hub.instance === this.instance) {
          // console.log('  update on instance and this client cares!', hub.instance, this.key)
          // or is part of the inheritance chain!
        } else {
          // console.log('  update on instance and this client does NOT care!', hub.instance, this.key)
          return
        }
      } else {
        // console.log('---- ok here!----', hub.instance, this.instance)
      }

      // console.log('------>', hub._path, hub.instance)
      if (this.connection && data !== void 0 && this._input) {
        let stamp = event.stamp
        if (typeof stamp !== 'string') {
          stamp = uuid + '-' + stamp
        }
        let output = this.parse(observable, hub, data, event)
        if (output !== void 0) {
          // where my mofo context path bitchez
          // why does send gets called 2 times here? its very strange
          // has to be caught -- mayeb do ignore clients!
          // now double check if there is an instance
          // if (this.instance) {
            // console.log('\n\n\n\nINSTANCE:', this.instance)
          // }

          // console.error('SEND!', '\nclient:', this.key, '\ninstance:', hub.instance, '\noutput:', output)

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
