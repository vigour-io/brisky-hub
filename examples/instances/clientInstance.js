'use strict'
var uuid = require('vjs/lib/util/uuid')
uuid.val = 'INSTANCE_A_' + uuid.val
var hub = require('../dev/ui').hub
// ofcourse we need reconnection strategies here WIP!

hub.adapter.instance.val = 'a'

setTimeout(() => {
  hub.adapter.val = 3031
}, 100)
