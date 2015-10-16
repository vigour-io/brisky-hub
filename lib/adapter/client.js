'use strict'
var Event = require('vjs/lib/event')

exports.properties = {
  client: require('../client')
}

exports.define = {
  getClient () {
    if (!this.client) {
      let hub = this.parent
      // client takes care of localstorage etc -- will also get an id generator
      // init events are checked
      let createClient = new Event(this, 'init')
      let id = ~~(Math.random() * 1000000) // replace with uuid
      // these types are ignored in sets to the upstream
      this.set({ client: id }, createClient)
      // makes reference tomyself in hubs clients object -- this is handy for reference
      hub.set(
        { clients: { [id]: this.client } },
        createClient
      )
      this.emit('init', this.client, createClient)
    }
    return this.client
  }
}
