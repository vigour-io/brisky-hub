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
    let adapter = data.lookUp('adapter')
    if (adapter === observable.lookUp('adapter')) {
      if (observable._input !== data) {
        return void 0
      }
      let dataPath = data.syncPath.concat()
      dataPath.unshift('$')
      return dataPath
    } else {
      return data.serialize()
    }
  } else if (typeof data === 'object' && data !== null) {
    if (!output) {
      output = {}
    }
    let origin
    for (var i in data) {
      if (!observable._properties[i] && i[0] !== '_') {
        if (observable[i] !== void 0 || (origin || (origin = observable.origin))[i]) {
          output[i] = parse(data[i], observable[i], void 0, event)
        }
      }
    }
  } else if (data instanceof Buffer) {
    data = decoder.write(output)
  } else {
    if (observable && (observable._input instanceof Base || event && observable.lastStamp === event.stamp)) {
      data = void 0
      output = void 0
    }
  }
  return output || data
}

exports.define = {
  parse (observable, hub, data, event) {
    let path = observable.syncPath
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
