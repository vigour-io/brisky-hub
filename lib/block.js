'use strict'
var Observable = require('vigour-js/lib/observable')
exports.properties = {
  block: new Observable({
    inject: [
      require('vigour-js/lib/operator/type'),
      require('vigour-js/lib/operator/transform')
    ],
    val: false
    // make this dynamic to switch -- sync clients as soon as its there
  })
}
