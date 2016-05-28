'use strict'

exports.properties = {
  clients: {
    syncUp: false,
    child: { type: 'client' }
  },
  client (val, stamp) {
    if (val.isClient) {
      // pass nocontext
      return this.setKeyInternal('client', val, stamp)
    } else if (this.client) {
      return this.client.origin().set(val, stamp)
    }
  }
}
