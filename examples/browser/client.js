'use strict'
var hub = require('../dev/ui').hub
// ofcourse we need reconnection strategies here WIP!
setTimeout(() => hub.adapter.val = 3031, 200)
setTimeout(() => hub.set({bla: 'something!'}), 300)
