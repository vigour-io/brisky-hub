'use strict'
const WsClient = require('websocket').w3cwebsocket
const vstamp = require('vigour-stamp')
const isEmpty = require('vigour-util/is/empty')

exports.properties = {
  upstream: true,
  reconnect: true,
  queue: true,
  context: {
    val: false,
    syncUp: false,
    syncDown: false,
    on: {
      data: {
        context: function () {
          console.log('hello context lezzzgo')
        }
      }
    }
  },
  url: {
    syncUp: false,
    syncDown: false,
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
          hub.set({ connected: false }, stamp)
          if (val) {
            connect(hub, val, 50)
          }
        }
      }
    }
  },
  connected: {
    syncUp: false,
    syncDown: false,
    on: {
      data: {
        queue: function (val, stamp) {
          const hub = this.cParent()
          var queue = hub.queue
          if (this.compute() === true && hub.upstream) {
            if (!queue) {
              queue = hub.queue = {}
            }
            queue.client = { id: hub.id, stamp: stamp }
            if (hub.context) {
              let context = hub.context.compute()
              if (context !== void 0 && context !== null) {
                queue.client.context = context
              }
            }
            if (hub.subscriptions) {
              queue.client.subscriptions = hub.subscriptions
            }
            send(hub)
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
  console.log('yo yo yo send it!', hub.queue)
  hub.upstream.send(JSON.stringify(hub.queue))
  hub.queue = null
}

function connect (hub, url, reconnect) {
  const connection = new WsClient(url, 'hubs')
  const id = hub.id

  // remove client as well?
  hub.set({ clients: { [id]: { id: id } } }, false)
  hub.set({ client: hub.clients[id] }, false)

  hub.reconnect = null
  connection.onerror = () => {
    connection.close()
  }
  connection.onmessage = (data) => {
    data = JSON.parse(data.data)
    console.log('====> INCOMING ON CLIENT <====', data.state)
    hub.set(data.state, data.stamp)
    vstamp.close(data.stamp)
  }
  connection.onopen = () => {
    const stamp = vstamp.create('connect')
    hub.set({ connected: true }, stamp)
    vstamp.close(stamp)
  }
  connection.onclose = () => {
    if (hub.connected) {
      const stamp = vstamp.create('disconnect')
      hub.set({ connected: false }, stamp)
      vstamp.close(stamp)
      if (!connection.blockReconnect) {
        reconnect = Math.min(~~(reconnect * 1.5), 2000)
        hub.reconnect = setTimeout(connect, reconnect, hub, url, reconnect)
      }
    }
  }
  hub.upstream = connection
}
