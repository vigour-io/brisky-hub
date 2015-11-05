'use strict'
var uuid = require('vigour-js/lib/util/uuid')
uuid.val = '3033_NORMAL_CLIENT_' + uuid.val
var hub = require('../dev/ui').hub
hub.key = 'hubs'
hub.adapter.val = 3033
