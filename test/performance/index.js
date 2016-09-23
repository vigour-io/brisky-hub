'use strict'
// const perf = require('vigour-performance')
const Hub = require('../../lib')

const server = new Hub({
  port: '6666'
})

const subs = {
  val: true
}

const client = new Hub({
  id: 'client1',
  url: 'ws://localhost:6666',
  context: false
})

client.subscribe(subs)

const client2 = new Hub({
  id: 'client2',
  url: 'ws://localhost:6666',
  context: false
})

client2.subscribe(subs)

const client3 = new Hub({
  id: 'client3',
  url: 'ws://localhost:6666',
  context: false
})

client3.subscribe(subs)

const client4 = new Hub({
  id: 'client4',
  url: 'ws://localhost:6666',
  context: false
})

client4.subscribe(subs)

var total = 0

var cnt = 0

function doSomething () {
  var t = Date.now()
  cnt++

  var obj = []
  for (var i = 0; i < 10000; i++) {
    obj.push(cnt)
  }

  server.set({
    blurf: obj,
    field: {
      something: { cnt }
    }
  })
  total += (Date.now() - t)
  if (cnt < 10) {
    setTimeout(doSomething, 100)
  } else {
    console.log(total + 'ms')
  }
}

setTimeout(() => {
  console.log('\n\nstart sending....')
  doSomething()
}, 1000)
