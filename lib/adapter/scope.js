'use strict'

exports.define = {
  getScope (id) {
    // scopes
    // need to be able to add special rules
    // content hub to client -- creation rules e.g scrtaper doing DE.nl
    // main hubs DE.nl.USERID
    // for now just return from instance map
    // merger in here? -- a merger is only nessecary on req so should be fine
    // when instance in client in adapter add this client to the new adapter -- clients are for now inherited
    // we skip them out later -- just look for client instance
  }
}

exports.scope = {
  on: {
    data: {
      scope (data, event) {
        // console.log('get instance from my upstream!', data, event)
        if (this.client && this.client.connection) {
          this.client.connection.send(JSON.stringify({
            scope: this.val,
            stamp: event.stamp
          }))
        } else {
          console.warn('no connection / client yet setting instance:', this.val)
        }
      }
    }
  }
}
