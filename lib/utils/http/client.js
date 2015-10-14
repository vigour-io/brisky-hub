'use strict'
/* dependencies */
var request = require('request')
var Observable = require('vjs/lib/observable')
var isValidUrl = require('../is/validurl')
var InvalidFormat = require('../errors/invalidformat')
var HttpRequestError = require('../errors/httprequesterror')

/**
 * Check if the URL passed as parameter is a valid url
 * and emits an InvalidFormat error if URL is not valid
 * @param  {String} url The URL to check
 * @return {boolean}
 */
function checkUrl (url) {
  if (!isValidUrl(url)) {
    this.emit('error', new InvalidFormat('Invalid URl format: ' + url))
    return false
  }
  return true
}

/**
 * Offers a way to manage reponses and emit a `data` event with the body
 * @param  {Object} err  Request error, if any
 * @param  {Object} res  The http response
 * @param  {Object} body The response body
 */
function manageResponse (err, res, body) {
  if (err) {
    this.emit('error', new HttpRequestError('Error performing the HTTP request: ' + err.message))
    return
  }
  // TODO meybe better res.statusCode management
  if (res.statusCode !== 200 && res.statusCode !== 201) {
    this.emit('error', new HttpRequestError('HTTP Request endedn with status code: ' + res.statusCode))
    return
  }
  this.emit('data', body)
}

/**
 * Build options to use for performing requets
 * @param  {String}   url   The URL to use for performing the request
 * @param  {Object}   body  Can be a Buffer, a String or a JSON
 * @param  {boolean}  gzip  Add the Accept-Encoding header to request compressed content
 * @return {Object}         The request options object
 */
function getRequestOptions (url, body, gzip) {
  var opts = {
    uri: url
  }
  if (body) opts.body = body
  if (gzip) opts.gzip = true
  return opts
}

var HttpClient = new Observable({
  define: {
    /**
     * Performs a GET request
     * @param {String}    url   Destination URL
     * @param {boolean}   json  Parse the repsonse as JSON
     */
    GET: function (url, json) {
      if (!checkUrl(url)) return
      var opts = getRequestOptions(url, null, true)
      if (json) opts.json = true
      return request.get(opts, manageResponse.bind(this))
    },
    /**
     * Performs a POST request
     * @param {String}  url     Destination URL
     * @param {Object}  data    Can be a Buffer, a String or a JSON
     * @param {boolean} json    Specify if the body is a JSON object
     */
    POST: function (url, data, json) {
      if (!checkUrl(url)) return
      var opts = getRequestOptions(url, data, true)
      if (json) opts.json = true
      return request.post(opts, manageResponse.bind(this))
    },
    /**
     * Performs a PUT request
     * @param {String}  url     Destination URL
     * @param {Object}  data    Can be a Buffer, a String or a JSON
     * @param {boolean} json    Specify if the body is a JSON object
     */
    PUT: function (url, data, json) {
      if (!checkUrl(url)) return
      var opts = getRequestOptions(url, data, true)
      if (json) opts.json = true
      return request.put(opts, manageResponse.bind(this))
    },
    /**
     * Performs a PATCH request
     * @param {String}  url     Destination URL
     * @param {Object}  data    Can be a Buffer, a String or a JSON
     * @param {boolean} json    Specify if the body is a JSON object
     */
    PATCH: function (url, data, json) {
      if (!checkUrl(url)) return
      var opts = getRequestOptions(url, data, true)
      if (json) opts.json = true
      return request.patch(opts, manageResponse.bind(this))
    },
    /**
     * Performs a DELETE request
     * @param {String} url Destination URL
     */
    DELETE: function (url) {
      if (!checkUrl(url)) return
      var opts = getRequestOptions(url, null, true)
      return request.del(opts, manageResponse.bind(this))
    }
  }
})

module.exports = HttpClient.Constructor

// USAGE EXAMPLE
//
// var req = new HttpClient.Constructor({
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
// req.PUT('http://jsonplaceholder.typicode.com/posts/1', {
//   title: 'New Test post'
// }, true)
// req.PATCH('http://jsonplaceholder.typicode.com/posts/1', {
//   title: 'New bazz post'
// }, true)
// req.DELETE('http://jsonplaceholder.typicode.com/posts/1')
