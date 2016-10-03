'use strict'
const isFn = /^\$fn\|/
const dummy = () => false

module.exports = function (subs, state) {
  subs = parse(subs, state)
  return subs
}

function parse (obj, state, key) {
  const result = {}
  for (let i in obj) {
    if (isFn.test(i)) {
      let val = obj[i]
      i = i.slice(4)
      // need to fix babel stuff in these funciton creations
      let pass
      try {
        obj[i] = new Function('return ' + val)() // eslint-disable-line
        pass = true
        obj[i](state, {}, {}, i)
        // do we want to test for null / void 0?
      } catch (e) {
        let msg
        console.log(e)
        if (!pass) {
          msg = `cannot parse function ${key}.exec\n${val}`
        } else {
          msg = `cannot run function ${key}.exec\n${val}`
        }
        state.emit('error', new Error(msg))
        obj[i] = dummy
      }
    }
    if (i === 'val' || i === 'exec') {
      result[i] = obj[i]
    } else {
      result[i] = parse(obj[i], state, i)
    }
  }
  return result
}
