'use strict'

const test = require('tape')
const Hub = require('../')

function hubDataSetAndRemove (amount, timeout) {
  timeout = timeout || 500
  var clearedAmount = 0
  test(`app hub restart & scraper data set - ${amount} times`, (t) => {
    const scraper = new Hub({
      id: 'scraper',
      port: 6000
    })
    const state = new Hub({
      id: 'state',
      url: 'ws://localhost:6000',
      port: 6001
    })
    state.subscribe({ val: true })
    var app = createAppHub()

    const interval = setInterval(() => {
      clearedAmount++
      if (clearedAmount > amount) {
        clearInterval(interval)
        t.equal(app.loldata && app.loldata.compute(), amount, `set of data and remove of app hub should be executed ${amount} times`)
        scraper.remove()
        state.remove()
        app.remove()
        t.end()
      } else {
        scraper.set({loldata: clearedAmount})
        app.remove()
        app = createAppHub()
      }
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

