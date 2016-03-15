'use strict'
var set = require('lodash.set')
var StringDecoder = require('string_decoder').StringDecoder
var decoder = new StringDecoder('utf8')
var isStream = require('vigour-util/is/stream')
// TODO: this will be removed soon!
// serialize for this too much special shit going on here!
// add stream support to observable ASAP

function parse (data, observable, output, event) {
  if (isStream(data)) {
    return
  } else if (data && data._base_version) {
    let adapter = data.lookUp('adapter')
    if (adapter === observable.lookUp('adapter')) {
      if (observable.__input !== data) {
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
    if (data === null) {
      if (observable.parent && observable.parent.__input === null) {
        // for sending out only
        data = void 0
        output = void 0
      }
    }

    if (observable && ((observable.__input && observable.__input._base_version) || event && observable.lastStamp === event.stamp)) {
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
          let newData = {}
          set(newData, path, data)
          data = newData
        }
      }
      return data
    }
  }
}
