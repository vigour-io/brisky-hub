'use strict'
/* dependencies */
var request = require('request')
var Observable = require('vjs/lib/observable')
var EmitError = require('vjs/lib/emitter/error')
var isValidUrl = require('../is/validurl')
var InvalidFormat = require('../errors/invalidformat')
var HttpRequestError = require('../errors/httprequesterror')

var error = EmitError()

function checkUrl (url) {
  if (!isValidUrl(url)) {
    error.emit(InvalidFormat('Invalid URl format: ' + url))
    return false
  }
  return true
}

function manageResponse (err, res, body) {
  if (err) {
    error.emit(HttpRequestError('Error performing the HTTP request: ' + err.message))
    return
  }
  // TODO meybe better res.statusCode management
  if (res.statusCode !== 200) {
    error.emit(HttpRequestError('HTTP Request endedn with status code: ' + res.statusCode))
    return
  }
  this.emit('data', body)
}

var HttpRequest = new Observable({
  define: {
    GET: function (url) {
      if (!checkUrl(url)) return
      return request.get({
        uri: url,
        gzip: true
      }, manageResponse.bind(this))
    },
    POST: function (url, data, json) {
      if (!checkUrl(url)) return
      var options = {
        body: data,
        uri: url,
        gzip: true
      }
      json ? options.json = true : void 0
      return request.post(options, manageResponse.bind(this))
    },
    PUT: function (url, data, json) {
      if (!checkUrl(url)) return
      var options = {
        body: data,
        uri: url,
        gzip: true
      }
      json ? options.json = true : void 0
      return request.put(options, manageResponse.bind(this))
    }
  }
})

module.exports = HttpRequest.Constructor

// var req = new HttpRequest.Constructor({
//   on: {
//     data: function (data, event) {
//       console.log(data)
//     }
//   }
// })
//
// req.GET('http://jsonplaceholder.typicode.com/posts')
// req.POST('http://jsonplaceholder.typicode.com/posts', {
//   userId: 1,
//   title: 'Test post',
//   body: 'my test content'
// }, true)
