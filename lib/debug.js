'use strict'
var isNumber = require('vigour-js/lib/util/is/number')

exports.serverLogger = function (req, res) {
  var _this = this
  // this.clearContext()
  // resolve for scope else its bullcraps
  var hub = _this.getRoot()
  // rly crap need to reset contexts everywhere if requesting the original -- super lame!
  // hub.clearContext()
  // hub.clearContextUp()
  // console.log('hub hub hub'.red)
  var path = req.url
  if (path && path !== '/') {
    path = path.replace(/\/$/, '')
    hub = hub.get(path.split('/').slice(1))
  }
  var ret
  // if (hub) {
    // use scopes? if not scopes hub---
    // we need to clear the context can go wrong now!
  if (hub && hub.serialize) {
    ret = hub.serialize()
  } else if (typeof hub === 'string' || isNumber(hub)) {
    ret = hub
  } else if (hub === null) {
    ret = 'null'
  } else if (typeof hub === 'object') {
    try {
      ret = JSON.stringify(hub, false, 2)
    } catch (e) {
      ret = '[Circular]'
    }
  } else {
    ret = 'undefined'
  }

  if (typeof ret === 'object') {
    res.end(JSON.stringify(ret, false, 2))
  } else {
    res.end(ret)
  }
}
