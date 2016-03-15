'use strict'
var Observable = require('vigour-observable')
var http = require('http')
// var https = require('https')
var servers = require('./list')

exports.http = new Observable({
  useVal: true,
  val (req, res) {
    res.end('vigour-hub')
  },
  define: {
    parseValue () {},
    create (val) {
      return (servers[val] = http.createServer((req, res) => {
        this.each((p) => {
          p.__input.call(this, req, res)
        })
        this.__input(req, res)
      }).listen(val))
    },
    server (val) {
      // have to destroy if you do this
      if (servers[val]) {
        servers[val].close()
        servers[val] = null
      }
      if (!servers[val]) {
        servers[val] = this.create(val)
      }
      servers[val]._this = this
      return servers[val]
    }
  }
})
