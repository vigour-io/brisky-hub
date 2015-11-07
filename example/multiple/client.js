'use strict'
var uuid = require('vigour-js/lib/util/uuid')
uuid.val = 'SCOPE_INSTANCE_' + uuid.val
var Hub = require('../../')
Hub.prototype.inject(require('../../dev'))
// Hub.prototype.inject(require('vigour-js/lib/observable/storage'))
var hub = require('../ui').hub
hub.adapter.val = {
  scope: 'meta',
  val: 3031
}
