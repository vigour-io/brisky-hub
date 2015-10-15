var Hub = require('../../lib/')

// var b = new Hub({})





var a = new Hub({
  key: 'myHubA',
  upstream: {
    adapter: {
      inject: require('../../lib/adapter/protocol/mock')
    }
  }
})


var b = new Hub({
  key: 'myHubB',
  upstream: {
    val: a,
    adapter: {
      inject: require('../../lib/adapter/protocol/mock')
    }
  }
})

console.log('fucking a', a)

// a.on(fun)


b.subscribe({
  b: true
}, function() {
  console.error('xxxx---xxxx')
  //eg: set on parent
})

a.set('b', 'bValue')

//create new subs emitter if its not attached to _on
//do a set on _on _on.set({ [subshash]: subsemitter })


// a.set({
//   b: '?'
// })
