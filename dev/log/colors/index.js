'use strict'
// this has to be solved at some point, e.g. browser and node index
var isNode = require('vigour-js/lib/util/is/node')
if (isNode) {
  require('colors')
} else {
  require('./browser')
}
