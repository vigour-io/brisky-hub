'use strict'
var uuid = require('vjs/lib/util/uuid')
uuid.val = 'NO_INSTANCE_' + uuid.val
var hub = require('../dev/ui').hub
setTimeout(() => {
  hub.adapter.val = 3031
}, 100)
