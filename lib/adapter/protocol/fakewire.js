'use strict'
var FakeWire = module.exports = function () {}
FakeWire.prototype.send = function (to, message) {
  // this is wire -- need to serilize clients etc
  console.info('send message', 'from hub', this.owner.getRoot().key)
  setTimeout(function() {
    console.log('?!@#', message)
    to.parseIncoming(message)
  }, 100)
}

FakeWire.prototype.receive = function (message) {
  console.info('receive message!', message)
  var _this = this
  setTimeout(function () {
    console.error('????')
    _this.owner.parseIncoming(message)
  }, 100)
}
