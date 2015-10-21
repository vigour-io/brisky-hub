'use strict'
exports.inject = require('vjs/lib/operator/transform')
exports.$transform = function (val) {
  return val > 999 ? ~~(val / 100) / 10 + 'k' : val
}
