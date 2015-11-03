'use strict'
var uuid = require('vjs/lib/util/uuid').val

exports.on = {
  data: {
    adapter (data, event) {
      var adapter
      var parent = this
      // console.log('fire it!', data)
      // use lookup! (need this everywhere)
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

      let adapaterClient = adapter.client
      let eventorigin = (
          event.stamp.indexOf &&
          event.stamp.indexOf('-') &&
          event.stamp.slice(0, event.stamp.indexOf('-'))
        ) || uuid

      if (adapaterClient && !event.upstream) {
        // console.log('ok send up!', 'datax', data, this._input, this._path)
        // console.log('something is very wrong with remove...')
        // if (!data && this._input === null) {
        //   data = null
        // }
        adapaterClient.send(this, adapter.parent, data, event)
      }

      if (event.upstream) {
        // console.log('datax!', this._path, data, adapter.parent.scope)
      }
      // this is the send to all clients function -- will be optional (subscription is whats nessecary)
      if (adapter.parent.clients) {
        adapter.parent.clients.each((client, key) => {
          client = client.origin
          // console.log('biaaathc', key, eventorigin, client.val)
          if (key !== eventorigin &&
            client !== event.client &&
            (!adapaterClient || client !== adapaterClient)
          ) {
            client.send(this, adapter.parent, data, event)
          } else {
            // console.log('6----', this.path, !!event.val, event.stamp, event.origin.path)
          }
        })
      }
    }
  }
}
