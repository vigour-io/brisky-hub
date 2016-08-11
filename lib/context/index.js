'use strict'

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
          // console.log('context need to start handeling this soon')
          const hub = this.root
          if (hub.client) {
            hub.client.origin().sendMeta()
          }
        }
      }
    }
  }
}
