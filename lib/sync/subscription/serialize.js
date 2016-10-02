'use strict'

function merge (a, b) {
  for (let i in b) {
    if (!a[i] || typeof a[i] !== 'object') {
      a[i] = b[i]
    } else {
      merge(a[i], b[i])
    }
  }
}

module.exports = function serializeSubscription (state, subs) {
  console.log('parse subs', subs)
  if (subs.client) {
    console.log('subs client')
    if (!subs.clients) {
      subs.clients = {}
    }
    if (!subs.clients[state.root.id]) {
      subs.clients[state.root.id] = subs.client
    } else {
      merge(subs.clients[state.root.id], subs.client)
    }
    delete subs.client
  }
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
          if (obj._.sync !== true) { result[i] = obj._.sync }
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
