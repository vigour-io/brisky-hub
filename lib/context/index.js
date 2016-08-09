'use strict'
const upstreamClient = require('../client/upstream')
const send = require('../upstream/send')

exports.define = {
  getContext (context) {
    const instances = this.instances
    if (instances) {
      for (let i = 0, len = instances.length; i < len; i++) {
        if (instances[i].context.compute() === context) {
          return instances[i]
        }
      }
    }
  }
}

exports.properties = {
  context: {
    val: false,
    sync: false,
    on: {
      data: {
        context (val, stamp) {
          const hub = this.root
          const clients = hub.clients
          if (this._last) {
            if (this._last && val !== null && clients) {
              console.log('hello', val)
              clients.each((prop, key) => {
                console.log(key)
                if (key !== hub.id) {
                  // problem is het stuur alles nog een keer door
                  // dus je connect naar context en het word door gestuurd
                  // super weird
                  // subs moeten weg -- hoe weet je of iets ok is qua context
                  // this is too fast
                  // need a system for this this is all too vague
                  console.log('REMOVE', prop)
                  // prop.remove()
                }
              })
            }
            upstreamClient(hub, stamp)
            if (hub.connected && hub.connected.compute()) {
              send(hub)
            }
          }
          this._last = true
        }
      }
    }
  }
}
