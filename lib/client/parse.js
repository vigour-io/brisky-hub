'use strict'
var Observable = require('vjs/lib/observable')
var setwithpath = require('vjs/lib/util/setwithpath')
var StringDecoder = require('string_decoder').StringDecoder
var decoder = new StringDecoder('utf8')
var isStream = require('vjs/lib/util/is/stream')

function parse(data, observable) {
  if (isStream(data)) {
    return
  } else if (typeof data === 'object') {
    for (var i in data) {
      if (!observable[i] || (i !== 'clients' && (observable._properties[i]))) {
        // handle clients special! make a field for that or something dont exclude
        delete data[i]
      } else if (observable[i]) {
        // console.log('???', i, Object.keys(observable._properties))
        data[i] = parse(data[i], observable[i])
      }
    }
  } else if (data instanceof Buffer) {
    data = decoder.write(output)
  }
  return data
}

exports.define = {
  parse (observable, hub, data, event) {
    let path = observable.hasOwnProperty('__path') && observable.__path
    if (!path) {
      path = observable.__path = observable.path
      if (path[0] === hub.key) {
        path.splice(0, 1)
      }
    }
    data = parse(data, observable)
    if (path.length > 0) {
      data = setwithpath({}, path, data)
    }
    return data
  }
}
