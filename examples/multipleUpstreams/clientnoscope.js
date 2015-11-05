'use strict'
var uuid = require('vjs/lib/util/uuid')
uuid.val = 'multiple_' + uuid.val
var hub = require('../dev/ui').hub
hub.set({ adapter: 3032 })
