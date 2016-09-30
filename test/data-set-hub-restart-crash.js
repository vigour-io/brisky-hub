'use strict'

const test = require('tape')
const Hub = require('../')

function hubDataSetAndRemove (amount, timeout) {
  timeout = timeout || 1000
  var clearedAmount = 0
  var scraperUpdates = 0
  test(`app hub restart & scraper data set - ${amount} times`, (t) => {
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
        t.equal(app.loldata && app.loldata.compute(), amount, `after resetting the app ${amount} times, it should receive the value from the scraper`)
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

hubDataSetAndRemove(1)
hubDataSetAndRemove(2)
hubDataSetAndRemove(3)
hubDataSetAndRemove(4)
hubDataSetAndRemove(5)

