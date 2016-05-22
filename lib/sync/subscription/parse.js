'use strict'
const isFn = /^\$fn-/
module.exports = function (subs) {
  subs = parse(subs)
  return subs
}

function parse (obj) {
  const result = {}
  for (let i in obj) {
    if (isFn.test(i)) {
      let val = obj[i]
      i = i.slice(4)
      // need to fix babel stuff in these parses
      // a posbility is to add some extra arguments
      obj[i] = new Function('return ' + val)() // eslint-disable-line
    }
    if (i === 'val' || i === 'done') {
      result[i] = obj[i]
    } else {
      result[i] = parse(obj[i])
    }
  }
  return result
}
