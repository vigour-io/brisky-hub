'use strict'
const isEmpty = require('vigour-util/is/empty')

module.exports = function (hub, state, val, stamp, offset) {
  if (!hub.queue) { hub.queue = {} }
  const queue = hub.queue
  const path = state.realPath(false, true)
  const last = path.length - 1
  // need to add this offset
  var target = queue[stamp]
  var select
  if (!target) {
    target = select = queue[stamp] = {}
    if (offset) {
      console.log('set offset')
      target.offset = offset
    }
    for (let i = 0; i < last; i++) {
      select = select[path[i]] = {}
    }
    select[path[last]] = createPayload(val)
    return true
  } else {
    select = target
    let done
    // needs shit loads of tests obviously
    // think about just merging all -- (losing some info)
    for (let i = 0; i < last; i++) {
      if (select[path[i]] || select[path[i]] !== void 0) {
        if (!select[path[i]] || typeof select[path[i]] !== 'object') {
          if (select[path[i]] === null) {
            done = true
          } else {
            select = select[path[i]] = { val: select[path[i]] }
          }
        } else {
          if (select[path[i]] === null) {
            done = true
          } else {
            select = select[path[i]]
          }
        }
      } else {
        select = select[path[i]] = {}
      }
    }
    if (!done) {
      let lastSegment = select[path[last]]
      if (lastSegment || lastSegment !== void 0) {
        if (val !== lastSegment) {
          if (!lastSegment || typeof lastSegment !== 'object') {
            lastSegment = select[path[last]] = { val: lastSegment }
          }
          select[path[last]] = mergePayload(val, lastSegment)
        }
      } else {
        if (val === null) {
          lastSegment = select[path[last]] = null
        } else {
          lastSegment = select[path[last]] = createPayload(val)
        }
      }
    }
  }
}

function mergePayload (val, target) {
  if (val && typeof val === 'object') {
    if (val.isState) {
      val = '$root.' + val.realPath(false, true).join('.')
      if (target && typeof target === 'object' && !isEmpty(target)) {
        target.val = val
      } else {
        target = val
      }
    } else {
      if (!target || typeof target !== 'object') {
        target = { val: target }
      }
      for (var i in val) {
        if (target[i] === void 0) {
          target[i] = {}
        }
        target[i] = mergePayload(val[i], target[i])
      }
    }
  } else {
    if (val === null) {
      target = null
    } else if (target && typeof target === 'object' && !isEmpty(target)) {
      target.val = val
    } else {
      target = val
    }
  }
  return target
}

function createPayload (val) {
  if (val && typeof val === 'object') {
    if (val.isState) {
      return '$root.' + val.realPath(false, true).join('.')
    }
    const result = {}
    for (var i in val) {
      result[i] = createPayload(val[i])
    }
    return result
  } else {
    return val
  }
}
