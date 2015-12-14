'use strict'
var Protocol = require('../protocol')

exports.on = {
  // reference: {
  //   adapter (data, event) {
  //     if (data === null) {
  //       console.log('211212121212------> MARK DIRTY', data, event, this._path.join('.'))
  //       this._markDirty = true
  //     }
  //   }
  // },
  data: {
    adapter (data, event) {
      // console.log('ON SYNCABLE:'.green, data, ' ', this.path.join('.'))
      // if (!event) {
      //   return
      // }

      if (data === void 0) {
        return
      }

      let adapter
      let parent = this

      while (!adapter && parent) {
        adapter = parent.adapter
        if (!adapter) {
          parent = parent.parent
        }
      }

      if (!adapter) {
        this.emit('error', 'no adapter yet')
        return
      }

      let id = adapter.id
      let eventorigin = (
          event.stamp.indexOf &&
          event.stamp.indexOf('|') &&
          event.stamp.slice(0, event.stamp.indexOf('|'))
        ) || id

      if (!event.upstream) {
        // sync to other upstreams??? may be confusing but could be nessecary ( a -> b )
        // console.error('okokok!', event.stamp)
        adapter.each(
          (property) => property.client.origin.send(this, adapter.parent, data, event, eventorigin),
          (property) => (property instanceof Protocol) && property._input && property.client
        )
      }

      // this is the send to all clients function -- will be optional (subscription is whats nessecary)
      if (adapter.parent.clients) {
        adapter.parent.clients.each((client, key) => {
          if (key !== eventorigin &&
            client.connection &&
            client !== event.client &&
            (client.connection && client.connection.origin.upstream && !client.connection.origin.upstream._input) // up or down
          ) {
            client.send(this, adapter.parent, data, event)
          }
        })
      }
    }
  }
}
