'use strict'
var Observable = require('vigour-js/lib/observable')
var setwithpath = require('vigour-js/lib/util/setwithpath')
var StringDecoder = require('string_decoder').StringDecoder
var decoder = new StringDecoder('utf8')
var isStream = require('vigour-js/lib/util/is/stream')

function parse (data, observable, output) {
  if (isStream(data)) {
    return
  // instanceof base
  } else if (typeof data === 'object' && data !== null) {
    if (!output) {
      output = {}
    }
    for (var i in data) {
      // add whitelist for props! (this clients thing is major ugly)
      if (!observable[i] || observable._properties[i]) {
        // delete data[i]
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
  parse (observable, hub, data, event, toUpstream) {
    let path = observable.path
    if (path[0] === hub.key) {
      path.splice(0, 1)
    }
    // lets check perhaps we have to send the parsed value
    if (!observable._parent || !observable._parent._properties[observable.key]) {
      // console.log('?', event.stamp, data)
      if (data instanceof Observable) {
        console.log('  oops parse may not handle observables yet...', data.path)
        data = data.serialize()
        // return
      } else {
        data = parse(data, observable)
      }
      var no = data
      if (path.length > 0) {
        data = setwithpath({}, path, data)
      }
      if (global.outgoingTrack && data !== void 0) {
        global.outgoingTrack.call(this, no, data, event, hub, toUpstream, observable._path)
      }
      return data
    }
  }
}
