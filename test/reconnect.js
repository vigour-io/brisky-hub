'use strict'
const test = require('tape')
const Hub = require('../')
// Error.stackTraceLimit = Infinity
const bufferTime = 100
test('reconnect state - without data sets', (t) => {
  const scraper = new Hub({
    context: false,
    id: 'scraper_' + String(Math.random()).slice(2),
    port: 6000,
    loldata: true
  })
  var state = createStateHub()
  t.ok(scraper.loldata.compute(), 'scraper data should be set')
  setTimeout(() => {
    t.ok(state.loldata && state.loldata.compute(), 'state data should be set (before reconnect)')
  }, bufferTime)
  setTimeout(() => {
    removeHub(state)
  }, bufferTime * 2)
  setTimeout(() => {
    state = createStateHub()
  }, bufferTime * 3)
  setTimeout(() => {
    t.ok(state.loldata && state.loldata.compute(), 'state data should be set (after reconnect)')
    removeHub(scraper)
    removeHub(state)
    t.end()
  }, bufferTime * 4)
})

test('reconnect state - with data sets', (t) => {
  var updates = 0
  const scraper = new Hub({
    context: false,
    id: 'scraper_' + String(Math.random()).slice(2),
    port: 6000,
    loldata: {
      on: {
        data () {
          updates++
        }
      }
    }
  })
  scraper.set({loldata: 0})
  var state = createStateHub()
  t.equal(scraper.loldata.compute(), 0, 'scraper data should be set')
  setTimeout(() => {
    t.equal(state.loldata && state.loldata.compute(), 0, 'state data should be set (before reconnect)')
  }, bufferTime)
  setTimeout(() => {
    state.remove()
    scraper.set({loldata: updates + 1})
  }, bufferTime * 2)
  setTimeout(() => {
    state = createStateHub()
    scraper.set({loldata: updates + 1})
  }, bufferTime * 3)
  setTimeout(() => {
    t.equal(state.loldata && state.loldata.compute(), updates, 'state data should be set (after reconnect)')
    scraper.remove()
    state.remove()
    t.end()
  }, bufferTime * 4)
})

reconnectApp(1)
reconnectApp(2)
reconnectApp(3)
reconnectApp(4)
reconnectApp(5)

function createStateHub () {
  const state = new Hub({
    context: false,
    id: 'state_' + String(Math.random()).slice(2),
    url: 'ws://localhost:6000',
    port: 6001
  })
  state.subscribe({val: true})
  return state
}

function createAppHub () {
  const app = new Hub({
    context: false,
    id: 'app_' + String(Math.random()).slice(2),
    url: 'ws://localhost:6001'
  })
  app.subscribe({ val: true })
  return app
}

function reconnectApp (amount, timeout) {
  timeout = timeout || 1000
  var clearedAmount = 0
  var scraperUpdates = 0
  test(`reconnect app (scraper, state, app) - ${amount} times - with sets`, (t) => {
    const scraper = new Hub({
      context: false,
    
    })
    const state = createStateHub()

    var app = createAppHub()

    const interval = setInterval(() => {
      if (clearedAmount === amount) {
        clearInterval(interval)
        t.equal(scraper.loldata && scraper.loldata.compute(), amount, 'the scraper should have the right data')
        t.equal(scraperUpdates, amount, `data on the scraper should be set ${amount} times`)
        t.equal(state.loldata && state.loldata.compute(), amount, 'state should have received the value from the scraper')
        t.equal(app.loldata && app.loldata.compute(), amount, `after reconnecting the app ${amount} times, it should receive the value from the scraper`)
        console.log('app.loldata', app.loldata && app.loldata.compute())
        removeHub(scraper)
        removeHub(state)
        removeHub(app)
        t.end()
      } else {
        scraper.set({loldata: clearedAmount + 1})
        removeHub(app)
        app = createAppHub()
      }
      clearedAmount++
    }, timeout)
  }, {timeout: (amount + 2) * timeout})
}

function removeHub (hub) {
  try {
    hub.remove()
  } catch (err) {
    console.log('REMOVE CRASHED :(')
    hub.downstream && hub.downstream.close()
  }
}
