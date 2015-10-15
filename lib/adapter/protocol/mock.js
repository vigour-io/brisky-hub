'use strict'
exports.protocol = {
  subscribe: function (pattern, path, stamp) {
    setTimeout(() => {
      var hash = require('vjs/lib/util/hash')
      this.receive({ b: Math.random() * 999 }, path, Math.random()*9999999,  hash(JSON.stringify(pattern)))
    }, 1000)
  },
  connect: function(clientId) {

  }
}
