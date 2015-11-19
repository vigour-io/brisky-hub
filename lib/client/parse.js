'use strict'
var Base = require('vigour-js/lib/base')
var setwithpath = require('vigour-js/lib/util/setwithpath')
var StringDecoder = require('string_decoder').StringDecoder
var decoder = new StringDecoder('utf8')
var isStream = require('vigour-js/lib/util/is/stream')

function parse (data, observable, output) {
  if (isStream(data)) {
    return
  } else if (data instanceof Base) {
    let adapter = data.lookUp('adapter')
    if (adapter === observable.lookUp('adapter')) {
      let adapterPath = adapter._path
      let dataPath = data._path
      let i = adapterPath.length - 1
      if (i) {
        dataPath.splice(0, i)
      }
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
      if (observable._properties[i] || i[0] === '_') {
      } else if (observable[i] || (origin || (origin = observable.origin))[i]) {
        output[i] = parse(data[i], observable[i])
      }
    }
  } else if (data instanceof Buffer) {
    data = decoder.write(output)
  }
  return output || data
}

exports.define = {
  parse (observable, hub, data, event) {
    let path = observable.path
    if (path[0] === hub.key) {
      path.splice(0, 1)
    }
    if (!observable._parent || !observable._parent._properties[observable.key]) {
      data = parse(data, observable)
      if (path.length > 0) {
        data = setwithpath({}, path, data)
      }
      return data
    }
  }
}
