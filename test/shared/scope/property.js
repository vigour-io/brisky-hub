'use strict'

module.exports = function (protocol, key) {
  describe('property', function () {
    var Hub = require('../../../lib')
    var hub = new Hub()
    it('can define scope using the scope property, setObject', function () {
      var james = {
        aField: true
      }
      hub.set({
        scope: {
          james: james
        }
      })
      expect(hub._scopeProperties)
        .to.have.property('james')
        .which.has.property('_input')
        .which.equals(james)
    })

    it('uses james setobject when getting james scope', function () {
      var jamesScope = hub.getScope('james')
      expect(jamesScope).to.have.property('aField')
    })

    it('can define scope using the scope property, function', function (done) {
      hub.set({
        scope: {
          marcus () {
            done()
          }
        }
      })
      hub.getScope('marcus')
    })

    it('can overwrite the getScope function', function (done) {
      hub.set({
        scope (scope, event) {
          done()
        }
      })
      hub.getScope('something')
    })
  })
}
