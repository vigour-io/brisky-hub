'use strict'
// not really nice maybe remove this for hub and state
var Hub = require('./')
module.exports = function (val, stamp) {
  return new Hub(val, stamp)
}
