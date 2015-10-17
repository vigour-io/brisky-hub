'use strict'
var Event = require('vjs/lib/event')
var isNode = require('vjs/lib/util/is/node')
// add ua to this as well! -- ua seperate npm module (parse all info imediatly, can be node whatever)

exports.properties = {
  client: require('../client')
}

exports.define = {
  getClient () {
    if (!this.client) {
      let hub = this.parent
      // client takes care of localstorage etc -- will also get an id generator
      // init events are checked
      let createClient = new Event(this, 'createClient')
      let id// replace with uuid

      if (isNode) {
        id = 'NODE-' + hub.key + '-pid-' + process.pid
      } else {
        id = 'BROWSER-' + hub.key + '-id-' + ~~(Math.random() * 100000)
      }
      // these types are ignored in sets to the upstream
      this.set({ client: id }, createClient, true)
      // can only have on client per adapter
      // context resolves carefull!
      // prob do no context!
      hub.set({ clients: { [id]: this.client } }, createClient)
      this.emit('createClient', this.client, createClient)
    }
    return this.client
  }
}
