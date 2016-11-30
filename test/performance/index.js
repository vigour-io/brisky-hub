'use strict'
// const perf = require('vigour-performance')
// @NOTE: removed vigour-performance dependency because of "engine" crash on yarn install
// should possibly be replaced with brisky-performance?

const Hub = require('../../lib')

const server = new Hub({
  port: '6666'
})

const subs = {
  blurf: {
    $any: {
      $test: {
        exec (val) {
          return val > 1
        },
        $pass: { val: true }
      }
    }
  },
  field: {
    something: {
      $test: {
        exec (val) {
          return val > 5
        },
        $pass: { val: true }
      }
    }
  }
}

var clients = []
for (var i = 0; i < 3; i++) {
  clients.push(new Hub({
    id: 'client' + i,
    url: 'ws://localhost:6666',
    context: false
  }))
  clients[clients.length - 1].subscribe(subs)
}

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
  if (cnt < 3) {
    setTimeout(doSomething, 100)
  } else {
    console.log(total + 'ms')
  }
}

setTimeout(() => {
  console.log('\n\nstart sending....')
  doSomething()
}, 1000)
