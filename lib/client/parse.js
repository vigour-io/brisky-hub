'use strict'
var Base = require('vigour-js/lib/base')
var setwithpath = require('vigour-js/lib/util/setwithpath')
var StringDecoder = require('string_decoder').StringDecoder
var decoder = new StringDecoder('utf8')
var isStream = require('vigour-js/lib/util/is/stream')

function parse (data, observable, output, event) {
  if (isStream(data)) {
    return
  } else if (data instanceof Base) {
    // console.log('2 - x bitch - parse for outgoing'.yellow.inverse, '-------->')
    let adapter = data.lookUp('adapter')
    if (adapter === observable.lookUp('adapter')) {
      // verify!

      if (observable._input !== data) {
        // console.log('HOORAY! WRONG!'.rainbow)
        return void 0
      }

      let adapterPath = adapter._path
      let dataPath = data._path
      let i = adapterPath.length - 1
      if (i) {
        dataPath.splice(0, i)
      }
      dataPath.unshift('$')
      return dataPath
    } else {
      // console.log('?????'.green.bold)
      return data.serialize()
    }
  } else if (typeof data === 'object' && data !== null) {
    if (!output) {
      output = {}
    }
    let origin
    // console.log('x bitch - parse for outgoing'.inverse, '-------->')
    for (var i in data) {
      if (observable._properties[i] || i[0] === '_') {
      } else if (observable[i] || (origin || (origin = observable.origin))[i]) {
        output[i] = parse(data[i], observable[i], void 0, event)
      }
    }
  } else if (data instanceof Buffer) {
    data = decoder.write(output)
  } else {
    // console.log('parse for outgoing'.inverse, '-------->', observable && observable._path && observable._path.join('.'))
    if (observable && (observable._input instanceof Base || event && observable.lastStamp === event.stamp)) {
      data = void 0
      output = void 0
    }
  }

  return output || data
}

exports.define = {
  parse (observable, hub, data, event) {
    let path = observable.path
    if (path[0] === hub.key) {
      path.splice(0, 1)
    }
    // removal must become better
    if (!observable._parent || !observable._parent._properties || !observable._parent._properties[observable.key]) {
      data = parse(data, observable, void 0, event)
      if (data !== void 0) {
        if (path.length > 0) {
          data = setwithpath({}, path, data)
        }
      }
      return data
    }
  }
}
