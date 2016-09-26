'use strict'
// need to use a function for sync -- in the funciton will recieve true if up or somethign
// addhere to play state content api -- add down / up

exports.properties = {
  syncUpIsFn: true,
  syncDownIsFn: true,
  syncUp (val) {
    if (!this.hasOwnProperty('child')) {
      this.set({ child: { child: 'Constructor' } }, false)
    }
    if (typeof val === 'function') {
      this.child.prototype.syncUp = this.syncUp = true
    }
    this.child.prototype.syncUp = this.syncUp = resolveState(val, this)
  },
  syncDown (val) {
    if (!this.hasOwnProperty('child')) {
      this.set({ child: { child: 'Constructor' } }, false)
    }
    if (typeof val === 'function') {
      this.child.prototype.syncDownIsFn = this.syncDownIsFn = true
    }
    this.child.prototype.syncDown = this.syncDown = resolveState(val, this)
  },
  sync (val) {
    return this.set({
      syncUp: val,
      syncDown: val
    }, false)
  }
}

function resolveState (val, spawned) {
  return (state) => {
    if (state && state.key !== spawned.key) {
      let found
      while (state && !found) {
        if (
          state.sid() === spawned.sid() ||
          (spawned._Constructor && state instanceof spawned._Constructor)
        ) {
          found = true
        } else {
          state = state.parent
        }
      }
    }
    return val(state)
  }
}

exports.syncUp = true
exports.syncDown = true
