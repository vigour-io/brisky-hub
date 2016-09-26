'use strict'
// need to use a function for sync -- in the funciton will recieve true if up or somethign
// addhere to play state content api -- add down / up
exports.properties = {
  syncUpIsFn: true,
  syncDownIsFn: true,
  syncUp (val) {
    this.syncUpIsFn = typeof val === 'function'
    this.syncUp = val
  },
  syncDown (val) {
    this.syncDownIsFn = typeof val === 'function'
    this.syncDown = val
  },
  sync (val) {
    return this.set({
      syncUp: val,
      syncDown: val
    }, false)
  }
}

exports.syncUp = true
exports.syncDown = true
