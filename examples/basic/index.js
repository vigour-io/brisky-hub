var Hub = require('../../lib/')

// var b = new Hub({})

var a = new Hub({
  key: 'myHubA',
  adapter: {
    inject: require('../../lib/adapter/protocol/mock')
  }
})

// a.adapter.val = false


var b = new Hub({
  key: 'myHubB',
  adapter: {
    inject: require('../../lib/adapter/protocol/mock')
  }
})

b.adapter.val = a

console.log(b)

console.log('fucking a', a)

// a.on(fun)

b.subscribe({
  b: true
}, function () {
  console.error('xxxx---xxxx')
  // eg: set on parent
})

console.error('hey im setting b on a!')

setTimeout(function() {
  a.set({
    b: true
  })
},1000)


//create new subs emitter if its not attached to _on
//do a set on _on _on.set({ [subshash]: subsemitter })


// a.set({
//   b: '?'
// })
