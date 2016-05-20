'use strict'
const WsClient = require('websocket').w3cwebsocket
const vstamp = require('vigour-stamp')
const isEmpty = require('vigour-util/is/empty')

exports.properties = {
  upstream: true,
  reconnect: true,
  queue: true,
  url: {
    type: 'observable',
    on: {
      data: {
        connect (data, stamp) {
          const hub = this.cParent()
          const val = this.compute()
          if (hub.upstream) {
            if (hub.reconnect) {
              clearTimeout(hub.reconnect)
              hub.reconnect = null
            }
            hub.upstream.blockReconnect = true
            hub.upstream.close()
          }
          if (val) {
            connect(hub, val, 50)
          } else {
            hub.connected.set(false, stamp)
          }
        }
      }
    }
  }
}

exports.define = {
  sendUp (state, val, stamp) {
    if (val !== void 0) {
      if (!this.connected.compute()) {
        queue(this, state, val, stamp)
      } else {
        const create = queue(this, state, val, stamp)
        if (create) { vstamp.on(stamp, () => send(this)) }
      }
    }
  }
}

exports.connected = {
  val: false,
  syncUp: false,
  syncDown: false,
  on: {
    data: {
      queue: function () {
        const hub = this.cParent()
        if (queue && this.compute() === true && hub.upstream) {
          send(hub)
        }
      }
    }
  }
}

function queue (hub, state, val, stamp) {
  if (!hub.queue) { hub.queue = {} }
  const queue = hub.queue
  const path = state.realPath(false, true)
  const last = path.length - 1
  var target = queue[stamp]
  var select
  if (!target) {
    target = select = queue[stamp] = {}
    for (let i = 0; i < last; i++) {
      select = select[path[i]] = {}
    }
    select[path[last]] = createPayload(val)
    return true
  } else {
    select = target
    for (let i = 0; i < last; i++) {
      select = select[path[i]]
      if (select || select !== void 0) {
        if (!select || typeof select !== 'object') {
          select = select[path[i]] = { val: select }
        }
      } else {
        select = select[path[i]] = {}
      }
    }
    let lastSegment = select[path[last]]
    if (lastSegment || lastSegment !== void 0) {
      if (val !== lastSegment) {
        if (!lastSegment || typeof lastSegment !== 'object') {
          lastSegment = select[path[last]] = { val: lastSegment }
        }
        select[path[last]] = mergePayload(val, lastSegment)
      }
    } else {
      lastSegment = select[path[last]] = createPayload(val)
    }
  }
}

function mergePayload (val, target) {
  // make a good isNull check dont need to continue moving
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
    if (target && typeof target === 'object' && !isEmpty(target)) {
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

function send (hub) {
  hub.upstream.send(JSON.stringify(hub.queue))
  hub.queue = null
}

function connect (hub, url, reconnect) {
  const connection = new WsClient(url, 'hubs')
  hub.reconnect = null
  connection.onerror = () => {
    connection.close()
  }
  connection.onmessage = (data) => {
    data = JSON.parse(data.data)
    hub.set(data.data, data.stamp)
    vstamp.close(data.stamp)
  }
  connection.onopen = () => {
    const stamp = vstamp.create('connect')
    hub.connected.set(true, stamp)
    vstamp.close(stamp)
  }
  connection.onclose = () => {
    if (hub.connected) {
      const stamp = vstamp.create('disconnect')
      hub.connected.set(false, stamp)
      vstamp.close(stamp)
      if (!connection.blockReconnect) {
        reconnect = Math.min(~~(reconnect * 1.5), 2000)
        hub.reconnect = setTimeout(connect, reconnect, hub, url, reconnect)
      }
    }
  }
  hub.upstream = connection
}
