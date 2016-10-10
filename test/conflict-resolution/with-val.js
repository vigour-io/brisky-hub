'use strict'

const test = require('tape')
const Hub = require('../../')
const fork = require('child_process').fork
const bigbuffer = 100
const smallbuffer = 10
const bail = true

const chalk = require('chalk')

const r = require('repl')
const repl = r.start({ prompt: '> ', useGlobal: true }).context

const states = {
  A: {
    testProperty: 'client1',
    testObj: {
      client1: true
    }
  },
  B: {
    testProperty: 'client3',
    testObj: {
      client1: true,
      client3: true
    }
  },
  C: {
    testProperty: 'client3',
    testObj: {
      client1: true,
      client2: true,
      client3: true
    }
  }
}

clear()

test('resolve old deep sets', t => {
  /*
    - client1 > does deep set on A (1)
    - client2 > does shallow set on A (2)
    - client2 > connects
    - client1 > connects
    - does client2 receive and accept deep (old) updates on A?
  */
  const server = new Hub({
    id: 'server',
    label: {
      val: 'server',
      sync: false
    },
    context: false,
    port: 6000,
    clients: { sort: 'key' }
  })
  makeClients(2).then(([ client1, client2 ]) => {
    repl.server = server
    repl.client1 = client1
    repl.client2 = client2
    /* client1 > does deep set on A (1) */
    client1.set({
      testObj: {
        client2: {
          nested: true
        },
        client1: {
          nested: true
        }
      }
    })
    setTimeout(step2, bigbuffer)

    function step2 () {
      /* client2 > does shallow set on A (2) */
      /* client2 > connects */
      console.log(chalk.black.bgCyan('\n+++++++++++++++ connect client2\n'))
      client2.set({
        testObj: {
          client2: 5
        },
        url: 'ws://localhost:6000'
      })
      server.clients.is(
        () => server.clients.keys().length === 1
      ).then(
        () => setTimeout(step3, smallbuffer)
      )
    }

    function step3 () {
      /* client1 > connects */
      console.log(chalk.black.bgCyan('\n+++++++++++++++ connect client1\n'))
      client1.set({
        url: 'ws://localhost:6000'
      })
      server.clients.is(
        () => server.clients.keys().length === 2
      ).then(
        () => setTimeout(checkState, smallbuffer)
      )
    }

    function checkState () {
      testState({
        testObj: {
          client2: {
            val: 5,
            nested: true
          },
          client1: {
            val: true,
            nested: true
          }
        }
      }, [server, client1, client2], t).then(
        () => {
          removeHubs(server, client1, client2)
          setTimeout(() => {
            t.end()
          }, smallbuffer)
        }
      )
    }
  })
})

test.skip('resolve old deep sets 2', t => {
  /*
    - client1 > does deep set on A (1)
    - client2 > does shallow set on A (2)
    - client3 > does shallow set on A (3)
    - client3 > connects
    - client1 > connects
    - client2 > connects
    - does client2 receive and accept
      - deep (old) updates (1)
      - shallow (new) updates (3)
  */
  const server = new Hub({
    id: 'server',
    label: {
      val: 'server',
      sync: false
    },
    context: false,
    port: 6000,
    clients: { sort: 'key' }
  })
  makeClients(3).then(([ client1, client2, client3 ]) => {
    repl.server = server
    repl.client1 = client1
    repl.client2 = client2
    repl.client3 = client3
    /* client1 > does deep set on A (1) */
    client1.set({
      testObj: {
        client2: {
          nested: true
        }
      }
    })
    setTimeout(step2, bigbuffer)

    function step2 () {
      /* client2 > does shallow set on A (2) */
      client2.set({
        testObj: {
          client2: 2
        }
      })
      setTimeout(step3, bigbuffer)
    }

    function step3 () {
      /*
        client3 > does shallow set on A (3)
        client3 > connects
      */
      console.log(chalk.black.bgCyan('\n+++++++++++++++ connect client3\n'))
      client3.set({
        testObj: {
          client2: 3
        },
        url: 'ws://localhost:6000'
      })
      server.clients.is(
        () => server.clients.keys().length === 1
      ).then(
        () => setTimeout(step4, smallbuffer)
      )
    }

    function step4 () {
      /* client1 > connects */
      console.log(chalk.black.bgCyan('\n+++++++++++++++ connect client1\n'))
      client1.set({
        url: 'ws://localhost:6000'
      })
      server.clients.is(
        () => server.clients.keys().length === 2
      ).then(
        () => {
          setTimeout(step5, smallbuffer)
          // global.go = () => step5()
        }
      )
    }

    function step5 () {
      /* client2 > connects */
      console.log(chalk.black.bgCyan('\n+++++++++++++++ connect client2\n'))
      client2.set({
        url: 'ws://localhost:6000'
      })
      server.clients.is(
        () => server.clients.keys().length === 3
      ).then(
        () => setTimeout(checkState, smallbuffer)
      )
    }

    function checkState () {
      testState({
        testObj: {
          client2: {
            val: 3,
            nested: true
          }
        }
      }, [server, client1, client2], t).then(
        () => {
          removeHubs(server, client1, client2)
          setTimeout(() => {
            t.end()
            process.exit()
          }, smallbuffer)
        }
      )
    }
  })
})

function testState (val, hubs, t) {
  const tests = []
  for (let hub of hubs) {
    tests.push(getSerialized(hub).then(
      serialized => {
        let hubOk = softEqual(serialized, val)
        if (!hubOk) {
          console.log('\n>>>>>>>', serialized.label, 'has bad data')
          console.log('testing\n', JSON.stringify(val, false, 2))
          console.log('serialized\n', JSON.stringify(serialized, false, 2))
          console.log('\n')
        }
        t.ok(hubOk, `${serialized.label} has correct data`)
        if (!hubOk && bail) {
          throw new Error('failed test')
        }
      }
    ))
  }
  return Promise.all(tests)
}

const getSerialized = hub => (hub instanceof Hub)
  ? Promise.resolve(hub.serialize())
  : new Promise(resolve => {
    hub.send({ label: 'report' })
    hub.on('message', msg => {
      resolve(msg.data)
    })
  })

function makeClients (n, mods, noset) {
  const clients = []
  var i = 0
  while (i !== n) {
    clients.push(makeClient(i, mods && mods[i], noset))
    i++
  }
  return Promise.all(clients)
}

function makeClient (n, mod, noset) {
  return new Promise((resolve) => {
    if (mod) {
      const clientProcess = fork(`${__dirname}/bad-clock-client`, [mod, n])
      clientProcess.on('message', (label, data) => {
        if (label === 'ready') {
          resolve(clientProcess)
        }
      })
    } else {
      let id = `client${n + 1}`
      let client = new Hub({
        id,
        label: {
          sync: false,
          val: id
        },
        context: false,
        url: 'ws://no-connect'
      })
      client.subscribe({ testProperty: { val: true }, testObj: { val: true } })
      if (noset) {
        resolve(client)
      } else {
        setTimeout(() => {
          client.set({
            testProperty: id,
            testObj: {
              [id]: true
            }
          })
          resolve(client)
        }, n * bigbuffer)
      }
    }
  })
}

function removeHubs () {
  var i = 0
  var hub
  while ((hub = arguments[i++])) {
    removeHub(hub)
  }
}

function removeHub (hub) {
  if (hub instanceof Hub) {
    try {
      hub.remove()
    } catch (err) {
      console.log('REMOVE CRASHED :(')
      hub.downstream && hub.downstream.close()
    }
  } else {
    hub.send({ label: 'destroy' })
  }
}

// function unique () {
//   var result = ''
//   var n = 3
//   while (n--) {
//     result += Number(String(Math.random()).slice(2)).toString(32)
//   }
//   return result
// }

function softEqual (a, b) {
  /*
    asserts if all properties of b are also in a (deep equal),
    but allows a to have other properties that are not in b.
  */
  if (typeof b !== 'object') {
    return a === b
  } else if (typeof a !== 'object') {
    return false
  } else {
    for (let key in b) {
      if (!softEqual(a[key], b[key])) {
        return false
      }
    }
    return true
  }
}

function clear () {
  var n = 100
  while (n--) {
    console.log()
  }
}
