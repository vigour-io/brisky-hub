'use strict'
var merge = require('vigour-js/lib/util/merge')

// just use buffer size etc on sockets -- this is very dirty
// maybe we can use the same stuff everywhere
// also adding a queue and max send of for example 1 per ms
module.exports = function (adapter, socket) {
  return function (data) {
    data = data.toString()
    var parse = data.split('}{')
    if (parse.length > 1) {
      // parse[0] = parse[0]
      // console.log('par2se'.red.inverse, parse)
      parse = parse.map((val) => {
        if (val[0] !== '{') {
          val = '{' + val
        }
        if (val[val.length - 1] !== '}') {
          val = val + '}'
        }
        return val
      })
      // console.log('par2se result'.red.inverse, parse)
      // for (var j in parse) {
      //   console.log(parse[j])
      // }
      // var mergeSet = {}

      for (let i in parse) {
        // console.log(parse[i])
        // merge(mergeSet, JSON.parse(parse[i]))
        // console.log(i, '!@#!@#!@#!@#!@#!@#', parse[i])
        let p
        try {
          p = JSON.parse(parse[i])
          adapter.parse(p, socket)
        } catch (e) {
          // console.error('oopsie cant parse!', i, parse[i])
        }
      }

      // console.log('???', JSON.parse(mergeSet))
      // adapter.parse(JSON.parse(parse[parse.length-1]), socket)
    } else {
      adapter.parse(JSON.parse(data), socket)
    }
  }
}
