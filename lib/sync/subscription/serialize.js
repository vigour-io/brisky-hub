'use strict'
// serializes the subscription not the payload
module.exports = function serializeSubscription (state, subs) {
  return parse(subs)
}

function parse (obj) {
  const result = {}
  for (let i in obj) {
    if (i !== '_') {
      if (i === 'exec' && typeof obj[i] === 'function') {
        let val = obj[i].toString()
        // convert es6 function probably....
        // add function for extra funcitons that you can add to it
        if (!/^(function|\()/.test(val)) {
          val = 'function ' + val
        }
        result['$fn-' + i] = val
      } else if (i === 'val') {
        if (obj._ && obj._.sync) {
          console.log('ok wtf???', obj)
          if (obj._.sync.val) { result[i] = obj._.sync.val }
        } else {
          result[i] = obj[i]
        }
      } else {
        result[i] = parse(obj[i])
      }
    }
  }
  return result
}
