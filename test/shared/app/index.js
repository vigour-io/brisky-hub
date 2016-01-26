'use strict'

var Hub = require('../../../lib')
module.exports = function (protocol, key) {
  var hub, clientA, clientB
  describe('create setup (hub, scraper, userhub)', function () {
    it('can create the server setup (2 clients, 1 hub, 1 scraper, 1 user-hub', function () {
      hub = new Hub({
        adapter: {
          inject: protocol,
          [key]: {
            val: key === 'mock' ? 'app-hub' : 6601
          }
        },
        scopes (scope) {
          console.log('SCOPE!!!!', arguments)
        }
      })

      clientA = new Hub({
        adapter: {
          inject: protocol
        }
      })

      clientB = new Hub({
        adapter: {
          inject: protocol
        }
      })
    })

    it('can connect clients on different scopes', function () {
      clientA.adapter.set({
        scope: 'user-a',
        [key]: key === 'mock' ? 'app-hub' : 'ws://localhost:6601'
      })
      clientB.adapter.set({
        scope: 'user-b',
        [key]: key === 'mock' ? 'app-hub' : 'ws://localhost:6601'
      })
    })
  })
}
