'use strict'
var Observable = require('vjs/lib/observable')

var FakeWire = require('./protocol/fakewire')
var Event = require('vjs/lib/event')

module.exports = new Observable({
  properties: { protocol: true },
  define: {
    recieve: function(payload, path, stamp, subsHash, instanceId, source) {
      // we check if source is up or down security checks (this can be done later!)
      //have to know if this came from an upstream or downstream!
      //need to know instance
      if(path) {

      } else {
        var Event = require('vjs/lib/event')
        var event = new Event(this.parent, 'data')
        event.stamp = stamp
        this.parent.set(payload, event)
      }
    },
    parseIncoming: function (message) {

      console.log('?!@222222222#', message)

      var parsed = message
      var client = message.client
      this.__tempclient__ = client
      if(parsed.$subscription) {
        let pattern = parsed.$subscription
        let target = this.parent
        target.subscribe(pattern, function (data, event) {
          // get the results fo the subscription dont rly know how to do :)
          let obj = {}
          if (data.added) {
            for(let i in data.added) {
              obj[data.added[i]] = target[data.added[i]].plain()
            }
            console.log('ok ok client!', client, this._path)

            if(!this.adapter._wire) {
              this.adapter._wire = new FakeWire()
              this.adapter._wire.owner = this
            }

            this.adapter._wire.send(client, {
              $write: obj
            })
            // setTimeout(() => t.recieve(obj, void 0, event.stamp), 1000)
          }
          console.log('Ok subscription got result lets git it and send it!', data)
          // this.send()
        })
      } else if (parsed.$write) {
        var writefromHubEvent = new Event(this._parent, 'data')
        writefromHubEvent.stamp = parsed.stamp
        this._parent.set(parsed.$write, writefromHubEvent )
      }
    },
    send: function() {

    },
    connect: function() {
      // we can find the url in the .val of the upstream

    },
    disconnect: function() {

    }
  }
}).Constructor
