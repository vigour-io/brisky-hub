'use strict'
var uuid = require('vigour-js/lib/util/uuid')
uuid.val = 'multiple_' + uuid.val
var hub = require('../dev/ui').hub
hub.adapter.val = 3032
