'use strict'
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
        // add function for extra functions that you can add to it
        // parse var names -- uglify it as well?
        if (!/^(function|\()/.test(val)) {
          val = 'function ' + val
        }
        // const body = val.match(/{((.|\s)*?)}/)[1]
        // const fns = body.match(/[a-z]{0,30}\((.*?)\)/g)
        // console.log('got some fn calls...', fns) -- we can do some requires pretty fance
        result['$fn|' + i] = val
      } else if (i === 'val') {
        if (obj._ && obj._.sync) {
          if (obj._.sync.val) { result[i] = obj._.sync.val }
        } else {
          result[i] = obj[i]
        }
      } else if (i === '$remove') {
        result[i] = obj[i]
      } else {
        result[i] = parse(obj[i])
      }
    }
  }
  return result
}
