'use strict'
var Observable = require('vjs/lib/observable')
var setwithpath = require('vjs/lib/util/setwithpath')
var StringDecoder = require('string_decoder').StringDecoder
var decoder = new StringDecoder('utf8')
var isStream = require('vjs/lib/util/is/stream')

function parse(data, observable) {
  if (isStream(data)) {
    return
  // instanceof base
  } else if (typeof data === 'object' && data !== null) {
    for (var i in data) {
      // add whitelist for props! (this clients thing is major ugly)
      if (!observable[i] || (i !== 'clients' && (observable._properties[i]))) {
        delete data[i]
      } else if (observable[i]) {
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
    let path = observable.path
    if (path[0] === hub.key) {
      path.splice(0, 1)
    }
    data = parse(data, observable)
    if (path.length > 0) {
      data = setwithpath({}, path, data)
    }
    return data
  }
}
