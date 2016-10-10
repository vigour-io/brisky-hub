'use strict'

const test = require('tape')
const Hub = require('../../')
const fork = require('child_process').fork
const bigbuffer = 100
const smallbuffer = 25
const bail = true
const timeout = 3e3
const chalk = require('chalk')
const serverPort = 60060
const hubs = []

// const r = require('repl')
// const repl = r.start({ prompt: '> ', useGlobal: true }).context
// repl.hubs = hubs

const smallPause = () => new Promise(resolve => {
  setTimeout(resolve, smallbuffer)
})
const bigPause = () => new Promise(resolve => {
  setTimeout(resolve, bigbuffer)
})

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

test('offline sets - good clocks', { timeout }, function (t) {
  /*
    - client1 created > does set (1)
    - client2 created > does set (2)
    - client3 created > does set (3)
    - client1 connects > server accepts (1)
    - client3 connects > server accepts (3)
    - client2 connects > server rejects (2)
  */
  const server = makeServer()

  makeClients(3).then(([ client1, client2, client3 ]) => {
    /* made the clients and did timed sets */
    // repl.client1 = client1
    // repl.client2 = client2
    // repl.client3 = client3
    // repl.server = server
    client1.set({
      url: `ws://localhost:${serverPort}`
    })
    return client1.connected.is(true).then(smallPause).then(() => {
      /* client1 connected and server should have data (1) */
      t.equals(
        server.get('testProperty.compute'),
        client1.id,
        'client1 set arrived'
      )
      client3.set({
        url: `ws://localhost:${serverPort}`
      })
      return client3.connected.is(true)
    }).then(smallPause).then(
      /* client3 connected and server has propagated data (3) */
      () => testState(states.B, [server, client1, client3], t)
    ).then(() => {
      /* connect client2 that has old data (2) */
      client2.set({
        url: `ws://localhost:${serverPort}`
      })
      return client2.connected.is(true)
    }).then(smallPause).then(
      /* client2 connected and data (3) should prevail */
      () => testState(states.C, [server, client1, client2, client3], t)
    )
  }).catch(err => {
    if (err.stack) {
      t.fail('crashed!', err.stack)
    }
  }).then(() => t.end())
})

test('reset', t => {
  cleanup()
  setTimeout(() => {
    t.end()
  })
})

test('offline sets - bad clocks', { timeout }, function (t) {
  /*
    - client1 (clock ahead) created > does set (1)
    - client2 created > does set (2)
    - client3 (clock behind) created > does set (3)
    - client1 connects > server accepts (1)
    - client3 connects > server accepts (3)
    - client2 connects > server rejects (2)
  */

  const server = makeServer()

  makeClients(3, [ 'ahead', '', 'behind' ], true).then(([ client1, client2, client3 ]) => {
    // repl.client1 = client1
    // repl.client2 = client2
    // repl.client3 = client3
    // repl.server = server
    /* have client1 (ahead) do set (1) while offline */
    client1.send({
      label: 'set',
      data: {
        label: 'client1',
        testProperty: 'client1',
        testObj: {
          client1: true
        }
      }
    })

    return new Promise((resolve, reject) => {
      client1.on('message', function checkSet (msg) {
        /* client1 says it did set, test that */
        const data = msg.data
        if (!data) {
          t.fail('weird message from client1', msg)
          reject()
        } else {
          t.equals(msg.data.testProperty, 'client1', 'client1 set testProperty')
          client1.removeListener('message', checkSet)
          resolve()
        }
      })
    }).then(bigPause).then(() => {
      /* have client2 (good clock) do set (2) while offline */
      client2.set({
        testProperty: 'client2',
        testObj: {
          client2: true
        }
      })
    }).then(bigPause).then(() => new Promise((resolve, reject) => {
      /* have client3 (behind) do set (3) while offline */
      client3.send({
        label: 'set',
        data: {
          testProperty: 'client3',
          testObj: {
            client3: true
          }
        }
      })
      client3.on('message', function checkSet (msg) {
        client3.removeListener('message', checkSet)
        const data = msg.data
        if (!data) {
          t.fail('weird message from client3', msg)
          reject()
        } else {
          t.equals(data.testProperty, 'client3', 'client3 set testProperty')
          resolve()
        }
      })
    })).then(smallPause).then(() => {
      console.log(chalk.black.bgCyan('\n+++++++++++++++ connect client1\n'))
      client1.send({
        label: 'set',
        data: {
          url: `ws://localhost:${serverPort}`
        }
      })
      return server.clients.is(() => server.clients.keys().length === 1)
    }).then(smallPause).then(
      () => testState(states.A, [server, client1], t)
    ).then(() => {
      console.log(chalk.black.bgCyan('\n+++++++++++++++ connect client3\n'))
      client3.send({
        label: 'set',
        data: {
          url: `ws://localhost:${serverPort}`
        }
      })
      return server.clients.is(() => server.clients.keys().length === 2)
    }).then(smallPause).then(
      () => testState(states.B, [server, client1, client3], t)
    ).then(() => {
      console.log(chalk.black.bgCyan('\n+++++++++++++++ connect client2\n'))
      client2.set({
        url: `ws://localhost:${serverPort}`
      })
      return server.clients.is(() => server.clients.keys().length === 3)
    }).then(smallPause).then(
      () => testState(states.C, [server, client1, client2], t)
    )
  }).catch(err => {
    if (err.stack) {
      t.fail('crashed!', err.stack)
    }
  }).then(() => t.end())
})

test('reset', t => {
  cleanup()
  setTimeout(() => {
    t.end()
  })
})

function testState (val, hubs, t) {
  const tests = []
  for (let hub of hubs) {
    tests.push(getSerialized(hub).then(
      serialized => {
        let hubOk = softEqual(serialized, val)
        if (!hubOk) {
          console.log(chalk.red('\n>>>>>>>', serialized.label, 'has bad data'))
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

function makeServer () {
  const server = new Hub({
    id: 'server',
    label: {
      val: 'server',
      sync: false
    },
    context: false,
    port: serverPort,
    clients: { sort: 'key' }
  })
  hubs.push(server)
  return server
}

function makeClients (n, mods, noset) {
  const clients = []
  var i = 0
  while (i !== n) {
    const client = makeClient(i, mods && mods[i], noset)
    clients.push(client)
    i++
  }
  return Promise.all(clients)
}

function makeClient (n, mod, noset) {
  return new Promise((resolve) => {
    if (mod) {
      const clientProcess = fork(`${__dirname}/bad-clock-client`, [mod, n])
      hubs.push(clientProcess)
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
      hubs.push(client)
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

function cleanup () {
  var hub
  while ((hub = hubs.pop())) {
    if (hub instanceof Hub) {
      hub.remove()
    } else {
      hub.kill('SIGINT')
    }
  }
}
