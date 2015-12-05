'use strict'
var Observable = require('vigour-js/lib/observable')
var http = require('http')
var servers = require('./list')
var isNumber = require('vigour-js/lib/util/is/number')
require('colors-browserify')

exports.http = new Observable({
  useVal: true,
  define: {
    create (val) {
      return (servers[val] = http.createServer(server).listen(val))
    },
    server (val) {
      if(servers[val]) {
        servers[val].close()
        servers[val] = null
      }
      if (!servers[val]) {
        servers[val] = this.create(val)
      }
      servers[val]._this = this
      // a/b/c maybe use full path always from root
      // can only use one server per hub unfortunately
      // else we need to handle it differently this is for now
      return servers[val]
    }
  }
})

function server (req, res) {
  var _this = this._this
  // this.clearContext()
  // resolve for scope else its bullcraps
  var hub = _this.getRoot()
  // rly crap need to reset contexts everywhere if requesting the original -- super lame!
  // hub.clearContext()
  // hub.clearContextUp()
  // console.log('hub hub hub'.red)
  var path = req.url
  if (path && path !== '/') {
    path = path.replace(/\/$/, '')
    hub = hub.get(path.split('/').slice(1))
  }
  var ret
  if (hub) {
    // use scopes? if not scopes hub---
    // we need to clear the context can go wrong now!
    if (hub.serialize) {
      ret = hub.serialize()
    } else if (typeof hub === 'string' || isNumber(hub)) {
      ret = hub
    } else {
      ret = {}
    }
  } else {
    ret = {}
  }
  res.end(JSON.stringify(ret, false, 2))
}
