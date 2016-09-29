'use strict'

const test = require('tape')
const Hub = require('../')

test('app-state-scraper', (t) => {
  var updates = 0
  const lolValue = 'FFFUUUU'

  const scraper = new Hub({
    id: 'scraper',
    port: 6000
  })

  const state = new Hub({
    id: 'state',
    loldata: {
      on: {
        data (val) {
          updates++
        }
      }
    },
    url: 'ws://localhost:6000',
    port: 6001
  })
  state.subscribe({ val: true })

  const app = new Hub({
    id: 'app',
    loldata: {
      on: {
        data (val) {
          updates++
        }
      }
    },
    url: 'ws://localhost:6001'
  })
  app.subscribe({ val: true })

  setTimeout(() => {
    scraper.set({
      loldata: lolValue
    })
    state.set({
      stateToApp: true
    })
    setTimeout(() => {
      t.equals(updates, 2, 'scraper update fired handlers in both state and app')
      t.equals(state.get('loldata.compute'), lolValue, 'state has loldata')
      t.equals(app.get('loldata.compute'), lolValue, 'app has loldata')
      t.ok(app.get('stateToApp.compute'), 'app got update from set on state')
      app.remove()
      state.remove()
      scraper.remove()
      t.end()
    }, 100)
  }, 100)
})
