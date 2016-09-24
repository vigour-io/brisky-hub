'use strict'
// serializes the subscription not the payload
module.exports = function serializeSubscription (state, subs) {
  return parse(subs)
}

function parse (obj, last, top) {
  const result = {}
  for (let i in obj) {
    if (i !== '_') {
      if (i === 'exec' && typeof obj[i] === 'function') {
        let val = obj[i].toString()
        // convert es6 function probably....
        if (!/^(function|\()/.test(val)) {
          val = 'function ' + val
        }
        result['$fn-' + i] = val
      } else if (i === 'val') {
        console.log('yo push it', obj)
        if (obj._ && obj._.sync) {
          console.log('resolve it')
        }
        result[i] = obj[i]
      } else {
        result[i] = parse(obj[i])
      }
    }
  }
  return result
}
