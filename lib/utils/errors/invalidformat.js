function InvalidFormat (message) {
  this.name = 'InvalidFormat'
  this.message = (message || '')
}

InvalidFormat.prototype = Error.prototype

module.exports = InvalidFormat
