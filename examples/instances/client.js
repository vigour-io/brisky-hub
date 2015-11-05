'use strict'
var uuid = require('vigour-js/lib/util/uuid')
uuid.val = '3031_NORMAL_CLIENT_' + uuid.val
var hub = require('../dev/ui').hub
hub.key = 'hubs'
setTimeout(() => hub.adapter.val = 3031, 100)
