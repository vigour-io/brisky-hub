'use strict'
exports.define = {
  parse (data, connection) {
    console.log('receive incoming message', data)
    if (data.$client) {
      console.log('---> $clientid', data.$client)
    }
  }
}
