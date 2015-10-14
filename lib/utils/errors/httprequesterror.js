function HttpRequestError (message) {
  this.name = 'HttpRequestError'
  this.message = (message || '')
}

HttpRequestError.prototype = Error.prototype

module.exports = HttpRequestError
