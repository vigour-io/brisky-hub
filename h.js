'use strict'
var Hub = require('./')
module.exports = function (val, stamp) {
  return new Hub(val, stamp || false)
}
