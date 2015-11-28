'use strict'
var Observable = require('vigour-js/lib/observable')
var http = require('http')
var servers = require('./list')

exports.http = new Observable({
  useVal: true,
  define: {
    create (val) {
      return servers[val] = http.createServer(server.bind(this)).listen(val)
    },
    server (val) {
      if (!servers[val]) {
        servers[val] = this.create(val)
      }
      // a/b/c maybe use full path always from root
      // can only use one server per hub unfortunately
      // else we need to handle it differently this is for now
      return servers[val]
    }
  }
})

function server (req, res) {
  var hub = this.getRoot()
  var path = req.url
  if (path && path !== '/') {
    console.log('ze guck')
    // path = path.replace(/\/$/, '')
    // console.log(path.split('/').slice(1))
    hub = hub.get(path.split('/').slice(1))
    console.log('wtf bitch', path.split('/').slice(1))
  }
  res.end(JSON.stringify((hub ? hub.serialize() : {}), false, 2))
}
