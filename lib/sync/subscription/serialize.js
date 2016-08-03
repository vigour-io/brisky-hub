'use strict'
module.exports = function serializeSubscription (state, subs) {
  return parse(subs)
}

function parse (obj, last) {
  const result = {}
  for (let i in obj) {
    if (i !== '_') {
      if (i === 'exec' && typeof obj[i] === 'function') {
        result['$fn-' + i] = obj[i].toString()
      } else if (i === 'val' || i === 'done') {
        result[i] = obj[i]
      } else {
        result[i] = parse(obj[i])
      }
    }
  }
  return result
}
