'use strict'
// var Observable = require('vigour-js/lib/observable')

exports.define = {
  push (payload) {
    if (!this.connected) {
      console.log('not connected!')
    }
    this.send(payload)
    // uses connected of course
  }
}
// queing times
