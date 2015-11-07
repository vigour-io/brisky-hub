'use strict'
require('colors-browserify')
var isNode = require('vigour-js/lib/util/is/node')
if (isNode) {
  console.clear = function () {
    let lines = process.stdout.getWindowSize()[1]
    for (let i = 0; i < lines; i++) {
      console.log('\r\n')
    }
  }
} else {
  let log = console.log
  let cnt = 0
  console.log = function () {
    cnt++
    if (cnt > 1000) {
      cnt = 0
      console.clear()
    }
    log.apply(this, arguments)
  }
}

exports.line = function () {
  var cols = isNode ? process.stdout.columns : 75
  var line = ''
  cols = cols - line.length
  while (cols) {
    cols--
    line = '_' + line
  }
  console.log(line.grey, '\n')
}

exports.length = function (str, len) {
  var abs = Math.abs(len)
  if (!str.length || str.length < abs) {
    for (var i = str.length; i < abs; i++) {
      str += ' '
    }
  } else if (str.length > abs) {
    if (len < 0) {
      str = str.slice(0, (abs - 3)) + '...'
    } else {
      str = '...' + str.slice(-(len - 3))
    }
  }
  return str
}
