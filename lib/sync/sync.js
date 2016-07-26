'use strict'
// need to use a function for sync -- in the funciton will recieve true if up or somethign
// addhere to play state content api -- add down / up

exports.properties = {
  syncUp: true,
  syncDown: true,
  sync (val) {
    return this.set({
      syncUp: val,
      syncDown: val
    }, false)
  }
}

exports.syncUp = true
exports.syncDown = true
