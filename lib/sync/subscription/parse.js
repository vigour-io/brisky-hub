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
      // need to fix babel stuff in these funciton creations
      // a posbility is to add some extra arguments, need to find requires etc as well
      obj[i] = new Function('return ' + val)() // eslint-disable-line
    }
    if (i === 'val' || i === 'done' || i === 'exec') {
      result[i] = obj[i]
    } else {
      result[i] = parse(obj[i])
    }
  }
  return result
}
