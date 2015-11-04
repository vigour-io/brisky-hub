'use strict'
exports.inject = [
  require('./client')
]
// replace this with seperate file (using pckg.json browser)
var isNode = require('vigour-js/lib/util/is/node')
if (isNode) {
  exports.inject.push(require('./server'))
}
