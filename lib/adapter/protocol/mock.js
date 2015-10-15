'use strict'

exports.define = {
  subscribe: function (pattern, path, stamp) {

    var target = this.val

    var pckg = {
      $subscription: pattern,
      path: path,
      stamp: stamp
    }

    if(target !== this) {
      console.log('hey hello!', this._path, target._path, pattern)
      // protocl receive message function (e.g. websocket .listen)

      //function(payload, path, stamp, subsHash, instanceId, source)
      var t = this
      target.subscribe(pattern, function (data, event) {
        // get the results fo the subscription dont rly know how to do :)
        var obj = {}

        if (data.added) {

          for(let i in data.added) {
            obj[data.added[i]] = target[data.added[i]].plain()
          }
          setTimeout(() => t.recieve(obj, void 0, event.stamp), 1000)
        }
        console.log('Ok subscription got result lets git it and send it!', data)
        // this.send()

      })
    }

  },
  connect: function(clientId) {

  }
}


/*
var hash = require('vjs/lib/util/hash')
this.receive({ b: Math.random() * 999 }, path, Math.random()*9999999,  hash(JSON.stringify(pattern)))
 */
