'use strict'

var uuid = require('vjs/lib/util/uuid')
uuid.val = 'SCOPE_INSTANCE_' + uuid.val
var hub = require('../dev/ui').hub
hub.adapter.val = {
  scope: 'meta',
  val: 3031
}
