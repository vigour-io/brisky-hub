'use strict'
var Observable = require('../observable')
var _remove = Observable.prototype.remove
var setwithpath = require('vjs/lib/util/setwithpath')
var uuid = require('vjs/lib/util/uuid').val
// var Event = require('vjs/lib/event')
module.exports = new Observable({
  properties: {
    connection: true
  },
  define: {
    remove (event, nocontext, noparent) {
      // need to remove all refs to client!!!
      return _remove.call(this, event, nocontext, noparent)
    },
    send (observable, hub, data, event) {
      if (this.connection && data !== void 0) {
        var path = observable.__path
        if (!path) {
          path = observable.__path = observable._path
          if (path[0] === hub.key) {
            path.splice(0, 1)
          }
        }

        // temp hack
        // only do updates when origin???
        // or at least origin made this? have events that need to relayed directly!
        if (typeof data === 'object') {
          for (var i in data) {
            if (observable._properties[i]) {
              delete data[i]
            } else {
              if (data[i] && data[i].useVal) {
                console.log('useval', i.red)
                // console.log(JSON.stringify( data[i].useVal.serialize()) )
                data[i] = data[i].useVal.serialize()
                // console.log()
              }
            }
          }
        }
        // console.log('hey!', path, data)
        var ret

        if (observable.key === 'clients' && data === null) {
          console.log('\n    fishy a null on something that should not be nulled at all!\n', '   path:', path, '\n')
          return
        }
        // set by path gaat nog niet heel lekker
        // parent moet altijd compleet zijn voordat je hier komt
        if (path.length === 0) {
          ret = data
        } else {
          ret = setwithpath({}, path, data)
        }
        let stamp = event.stamp
        if (typeof stamp !== 'string') {
          // when its myself
          stamp = uuid + '-' + stamp
        }
        // currentStatus.last Set = JSON.stringify(ret) + ' ' + stamp + ' ' + path.join('.')
        // console.log('outgoing!'.cyan.bold.inverse, stamp, 'client!', this.val)

        this.connection.send(JSON.stringify({ set: ret, stamp: stamp }))
      }
    }
  },
  ChildConstructor: 'Constructor'
}).Constructor

// connection is a flag for i am doing this one!

// connection moet shit doen
// remove also has to remove all references!
