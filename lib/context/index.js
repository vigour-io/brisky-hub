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
    // sync: true,
    on: {
      data: {
        context: function () {
          console.log(' ---> need to be send up')
        }
      }
    }
  }
}
