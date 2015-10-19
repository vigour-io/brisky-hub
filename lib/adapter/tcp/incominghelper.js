'use strict'
module.exports = function (adapter) {
  return function (data) {
    var socket = this
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
      for (let i in parse) {
        adapter.parse(JSON.parse(parse[parse.length - 1]), socket)
      }
    } else {
      adapter.parse(JSON.parse(data), socket)
    }
  }
}
