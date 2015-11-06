'use strict'
var uuid = require('vigour-js/lib/util/uuid')
uuid.val = 'SCOPE_INSTANCE_' + uuid.val
// Hub.prototype.inject(require('vigour-js/lib/observable/storage'))
var hub = require('../ui').hub
hub.adapter.val = {
  scope: 'meta',
  val: 3031
}

let colors = require('colors-browserify')
console.log('?xweknweoienwoinde'.blue.bold.rainbow.bgRed, colors)
