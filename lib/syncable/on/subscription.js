'use strict'

module.exports = function (load, event, client) {
  console.log('FIRE SUBS!'.blue.bold.inverse, load, this._path)
  var adapter = this.getAdapter()
  if (!adapter) {
    return
  }
  for(var i in load) {
    client.send(load[i].origin, adapter.parent, load[i].data, event)
  }
}
