'use strict'
exports.define = {
  parse (data, connection) {
    if (data.$client) {
      console.log('---> $clientid', data.$client)
    }
  }
}
