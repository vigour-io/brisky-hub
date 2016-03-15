'use strict'
exports.on = {
  data: {
    adapter (data, event) {
      if (data === void 0 || event.type === 'level') {
        return
      }
      if ((this.__input !== void 0 || data === null)) {
        this.sendUpstream(data, event)
      }
    }
  }
}

exports.define = {
  sendUpstream (data, event) {
    var adapter = this.getAdapter()
    if (!adapter) {
      return
    }
    let eventorigin = this.parseEvent(event, adapter)
    if (!eventorigin) {
      return
    }
    if (!event.upstream) {
      adapter.each((protocol) => {
        protocol.client.origin.send(this, adapter.parent, data, event)
      })
    }
  }
}
