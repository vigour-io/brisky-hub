
describe('upstream', function () {
  var Hub = require('../../../lib')
  var Upstream = require('../../../lib/upstream/constructor')
  var Adapter = require('../../../lib/adapter/constructor')

  it('create a upstream property', function () {
    var a = new Hub({
      upstream: {

      }
    })
    expect(a.upstream).instanceof(Upstream)
  })

  it('create an adapter property', function () {
    var a = new Hub({
      upstream: {
        adapter: {
          val: 'https://bla.com'
        }
      }
    })
    expect(a.upstream.adapter).instanceof(Adapter)
  })
})
