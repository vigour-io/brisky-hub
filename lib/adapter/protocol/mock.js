'use strict'
var FakeWire = require('./fakewire')



exports.on = {
  data: function () {
    // if (!this._wire) {
    console.error('hey hey hey set wire', this._path, this.val._path)
    this._wire = new FakeWire()
    this._wire.owner = this
    this._wire.target = this.val
    // }
  }
}

exports.define = {
  subscribe: function (pattern, path, stamp) {
    var target = this.val

    var message = {
      $subscription: pattern,
      path: path,
      stamp: stamp,
      client: this // this will be an id ofcourse!
    }
    // create fakeWire on connection!
    if (target !== this) {
      console.log('hey hello!', this._path, target._path, pattern)
      // protocl receive message function (e.g. websocket .listen)
      this._wire.send(target.adapter, message)
      // function(payload, path, stamp, subsHash, instanceId, source)
      var t = this
    }
  }
}


/*
var hash = require('vjs/lib/util/hash')
this.receive({ b: Math.random() * 999 }, path, Math.random()*9999999,  hash(JSON.stringify(pattern)))
 */
