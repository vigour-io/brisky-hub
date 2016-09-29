'use strict'
const vstamp = require('vigour-stamp')

exports.define = {
  receive (data) {
    if (data.state) {
      // console.log('incoming:', data)

      // if (this.root.port) {
      //   if (data.state.content && data.state.content.shows && data.state.content.current) {
      //     console.log(this.root.id, JSON.stringify(data.state, false, 2))
      //     delete data.state.search
      //     delete data.state.content.shows
      //   }
      // }

      const hub = this
      const hubcontext = hub.context && hub.context.compute()
      if (!(!data.context && !hubcontext) && data.context != hubcontext) { //eslint-disable-line
        if (data.state && data.state.clients) {
          // what this for exactly
          delete data.state.clients
        }
      }
      hub.set({ incomingStamps: {} }, false)
      hub.set(data.state, false)
      hub.emit('subscription')
      for (let stamp in hub.incomingStamps) {
        vstamp.close(stamp)
      }
      hub.set({ incomingStamps: false }, false)
    }
  }
}
