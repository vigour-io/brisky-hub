'use strict'
var Observable = require('vigour-js/lib/observable')
var setwithpath = require('vigour-js/lib/util/setwithpath')
var StringDecoder = require('string_decoder').StringDecoder
var decoder = new StringDecoder('utf8')
var isStream = require('vigour-js/lib/util/is/stream')

function parse (data, observable, output) {
  if (isStream(data)) {
    return
  } else if (typeof data === 'object' && data !== null) {
    if (!output) {
      output = {}
    }
    for (var i in data) {
      if (!observable[i] || observable._properties[i]) {
      } else if (observable[i]) {
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
      if (data instanceof Observable) {
        console.log('  oops parse may not handle observables yet...', data.path)
        data = data.serialize()
      } else {
        data = parse(data, observable)
      }
      if (path.length > 0) {
        data = setwithpath({}, path, data)
      }
      return data
    }
  }
}
