'use strict'
var isPlain = require('vigour-js/lib/util/is/plainobj')
exports.properties = {
  _protocol: true,
  protocol (val, event) {
    var protocol = this._protocol
    if (!this.hasOwnProperty('_protocol')) {
      this._protocol = protocol = {}
    }
    console.log('lets set some protocol!', val)
    if (isPlain(val)) {
      for (let field in val) {
        protocol[field] = val[field]
      }
    } else {
      // add more rules for up/down ids etc
      protocol.up = val
      protocol.down = val
    }
  }
}
