'use strict'
var FakeWire = module.exports = function () {}
FakeWire.prototype.send = function (to, message) {
  // this is wire -- need to serilize clients etc
  console.log('????')
  to.parseIncoming(message)
}

FakeWire.prototype.receive = function (message) {
  console.log('receive message!', message)
  this.owner.parseIncoming(message)
}
