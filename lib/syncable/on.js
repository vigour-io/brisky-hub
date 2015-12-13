'use strict'
var Protocol = require('../protocol')

exports.on = {
  data: {
    adapter (data, event) {
      // console.log('data fires', this.path)

      var adapter
      var parent = this

      if (!this.getRoot()._scope) {
        let p = this._path.join('.')
        let piv
        if (p === ['clients_s_server', 'clients', 'clients_s_receiver2'].join('.')) {
          piv = true
          console.warn('\n\nthis is it!', data)
          // something is very off here! this guy is supposed to be getting removed!
          console.log(this._input)
        }
        // console.log('syncable on:', this.getRoot()._scope, p, 'isremoved:', data === null, data)
        if (piv) {
          console.warn('--------')
        }
      }

      while (!adapter && parent) {
        adapter = parent.adapter
        if (!adapter) {
          parent = parent.parent
        }
      }

      if (!adapter) {
        this.emit('error', 'no adapter yet')
        // console.error('ok ok')
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
        // console.error('---------------')
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
