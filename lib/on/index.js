'use strict'
var On = require('vjs/lib/observable/on/constructor')
var _setKey = On.prototype.setKey
var SubsEmitter = require('vjs/lib/observable/subscribe/emitter')

var MyOn = new On({
  // inject: require('vjs/lib/methods/lookup'),
  define: {
    setKey (key, val, event) {
      var ret = _setKey.apply(this, arguments)
      if (val instanceof SubsEmitter) {
        // var up = this.lookup('upstream')
        var upstream = this.getRoot().upstream

        console.warn( upstream.adapter )
        //previous event stamp of subscription
        upstream.adapter.subscribe(val._pattern, void 0, void 0)
        console.log('ok this is a subsemitter need to send to valerio!', upstream, val._pattern)
      }
      return ret
    }
  }
})

exports.properties = {
  on: { val: MyOn, override: '_on' }
}
