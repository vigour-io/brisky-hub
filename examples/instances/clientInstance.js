'use strict'
var uuid = require('vigour-js/lib/util/uuid')
uuid.val = 'INSTANCE_A_' + uuid.val
var hub = require('../dev/ui').hub
// ofcourse we need reconnection strategies here WIP!
hub.adapter.scope.val = 'a'
hub.adapter.val = 3031
