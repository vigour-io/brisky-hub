'use strict'
const test = require('tape')
const Hub = require('../')

test('subscribe - $any - references - $test', { timeout: 1000 }, function (t) {
  var done
  const subs = {
    letters: {
      $any: {
        $test: {
          exec: (state) => true,
          $pass: {
            val: true
          }
        }
      }
    }
  }

  const server = new Hub({
    id: 'server',
    context: false,
    port: 6000,
    letters: [ '$root.az.0', '$root.az.1', '$root.az.2' ],
    az: [ 'a', 'b', 'c' ]
  })

  const client = new Hub({
    id: 1,
    url: 'ws://localhost:6000',
    context: false
  })

  client.subscribe(subs, () => {
    if (!done && client.letters) {
      if (!client.letters.each((prop, i) => prop.val !== client.az[i])) {
        t.pass('letters reference az\'s')
        t.end()
        done = true
      }
    }
  })
})
