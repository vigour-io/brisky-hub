'use strict'
const isFn = /^\$fn-/
const dummy = () => () => false

module.exports = function (subs) {
  subs = parse(subs)
  return subs
}

function parse (obj, state) {
  const result = {}
  for (let i in obj) {
    if (isFn.test(i)) {
      let val = obj[i]
      i = i.slice(4)
      // need to fix babel stuff in these funciton creations
      try {
        obj[i] = new Function('return ' + val)() // eslint-disable-line
      } catch (e) {
        // state.root.emit('error', new Error('cannot parse function\n' + val))
        obj[i] = dummy
      }
    }
    if (i === 'val' || i === 'exec') {
      result[i] = obj[i]
    } else {
      result[i] = parse(obj[i])
    }
  }
  return result
}
