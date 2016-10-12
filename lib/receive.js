'use strict'
const vstamp = require('vigour-stamp')

exports.define = {
  receive (data) {
    if (data.state) {
      const hub = this
      const hubcontext = hub.context && hub.context.compute()
      if (!(!data.context && !hubcontext) && data.context != hubcontext) { //eslint-disable-line
        if (data.state && data.state.clients) {
          delete data.state.clients
        }
      }

      hub.set(data.state, false)
      hub.resubscribe()

      const stamps = hub.incoming
      hub.set({ incoming: false }, false)

      for (let stamp in stamps) {
        vstamp.close(stamp)
      }
    }
  }
}
