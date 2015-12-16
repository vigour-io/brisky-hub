'use strict'
exports.seperator = '|'
var inlined = /\|/
exports.isNetworkStamp = function (val) {
  return inlined.test(val)
}
