var http = require('http')
require('vigour-element/lib/util/require')
var app = require('./index.js')
var zlib = require('zlib')
var stream = require('stream')
// var fs = require('fs')
var js = 'http://jim.local:8104/bundle.js?$app=192.168.0.12:8104/example/more/index.js'
var css = 'http://jim.local:8104/bundle.css?$app=192.168.0.12:8104/example/more/index.js'
var vua = require('vigour-ua')

function make (js, css) {
  var str = '<html utf-8><head>'
  str += '<meta http-equiv="Content-type" content="text/html; charset=utf-8" />'
  str += '<link href="' + css + '" rel="stylesheet" type="text/css">'
  str += '</head><body>'
  str += app.val
  // str += '<script src="' + js + '" type="text/javascript"></script>'
  str += '</body></html>'
  return str
}

var Syncable = require('../../lib/syncable')
Syncable.prototype.on('data', function () {
  app.___cache = null
}, 'appserver')

// this is it
http.createServer(function (req, res) {
  var ua = req.headers['user-agent']
  ua = vua(ua)
  // console.log('ok ok got ', ua)
  // get correct apps for correct uas -- this will be tricky...
  // maybe just run a nod einstance for each? -- pretty dirty but...
  var raw = new stream.Readable()
  var jstosend = js
  var csstosend = css
  gzip(req, res, raw)
  // make this into a stream is super easy!
  raw.push(make(jstosend, csstosend))
  raw.push(null)
}).listen(3033)

function gzip (req, res, raw) {
  var acceptEncoding = req.headers['accept-encoding']
  if (!acceptEncoding) {
    acceptEncoding = ''
  }
  if (acceptEncoding.match(/\bdeflate\b/)) {
    res.writeHead(200, { 'content-encoding': 'deflate' })
    raw.pipe(zlib.createDeflate()).pipe(res)
  } else if (acceptEncoding.match(/\bgzip\b/)) {
    res.writeHead(200, { 'content-encoding': 'gzip' })
    raw.pipe(zlib.createGzip()).pipe(res)
  } else {
    res.writeHead(200, {})
    raw.pipe(res)
  }
}
