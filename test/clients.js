'use strict'
const test = require('tape')
const Hub = require('../')

test('clients', { timeout: 2e3 }, (t) => {
  t.plan(12)

  const subs = {
    clients: {
      $any: {
        upstream: { val: true },
        ip: { val: true },
        device: { val: true },
        platform: { val: true }
      }
    }
  }

  const server = new Hub({
    id: 'server',
    clients: { sort: 'key' },
    port: 6000,
    field: { nested: 'suc6' }
  })

  const hybrid = new Hub({
    id: 'hybrid',
    context: false,
    url: 'ws://localhost:6000',
    port: 6001
  })

  const client = new Hub({
    id: 'client',
    context: false,
    url: 'ws://localhost:6001',
    x: true
  })

  hybrid.subscribe({ val: true }) // subscribe to all
  client.subscribe(subs)

  const clientIsConnected = client.connected.is(true)
    .then(() => t.ok(true, 'client connected to hybrid'))

  const hasUpstream = client.client.origin().get('upstream', {}).is('hybrid')
    .then(() => t.ok(true, 'upstream on client is hybrid'))

  const hasIp = client.client.origin().get('ip', {}).is('::ffff:127.0.0.1')
    .then(() => t.ok(true, 'ip on client is localhost'))

  const hybridIsConnected = hybrid.connected.is(true)
    .then(() => t.ok(true, 'hybrid connected to server'))

  const hasClients = server.get('clients', {}).is(() => server.clients.keys().length > 1)

  const hybridHasServerFields = hybrid.get('field.nested', {}).is('suc6')
    .then(() => t.ok(true, 'hybrid recieves all fields'))

  Promise.all([
    clientIsConnected, hasUpstream, hasIp, hybridIsConnected, hasClients, hybridHasServerFields
  ]).then(() => {
    t.same(server.clients.keys(), [ 'client', 'hybrid' ], 'server got all clients')
    t.equal(client.client.origin().device.compute(), 'server', 'client receives correct device type')
    t.equal(client.client.origin().platform.compute(), 'node.js', 'client receives correct platform')
    t.equal(server.clients.client.device.compute(), 'server', 'server recieves correct client device type')
    t.equal(server.clients.client.platform.compute(), 'node.js', 'server recieves correct client platform')
    server.get('x', {}).is(true).then(() => {
      t.ok(true, 'server got x from client')
      disconnect()
    })
  })

  function disconnect () {
    client.set({ url: null })
    server.get('clients.client').is(null).then(done)
  }

  function done () {
    t.ok(true, 'client got removed from server')
    server.remove()
    hybrid.remove()
    client.remove()
    t.end()
  }
})

function reconnect (amount, timeout) {
  timeout = timeout || 1000
  var clearedAmount = 0
  var scraperUpdates = 0
  test(`reconnect - ${amount} times`, (t) => {
    const scraper = new Hub({
      id: 'scraper',
      port: 6000,
      loldata: {
        on: {
          data (val) {
            scraperUpdates++
          }
        }
      }
    })
    const state = new Hub({
      id: 'state',
      url: 'ws://localhost:6000',
      port: 6001
    })
    state.subscribe({ val: true })

    var app = createAppHub()

    const interval = setInterval(() => {
      if (clearedAmount === amount) {
        clearInterval(interval)
        t.equal(scraper.loldata && scraper.loldata.compute(), amount, 'the scraper should have the right data')
        t.equal(scraperUpdates, amount, `data on the scraper should be set ${amount} times`)
        t.equal(state.loldata && state.loldata.compute(), amount, 'state should have received the value from the scraper')
        t.equal(app.loldata && app.loldata.compute(), amount, `after reconnecting the app ${amount} times, it should receive the value from the scraper`)
        scraper.remove()
        state.remove()
        app.remove()
        t.end()
      } else {
        scraper.set({loldata: clearedAmount + 1})
        app.remove()
        app = createAppHub()
      }
      clearedAmount++
    }, timeout)
  }, {timeout: (amount + 2) * timeout})
}

function createAppHub () {
  const app = new Hub({
    id: 'app',
    url: 'ws://localhost:6001'
  })
  app.subscribe({ val: true })
  return app
}

reconnect(1)
reconnect(2)
reconnect(3)
reconnect(4)
reconnect(5)

