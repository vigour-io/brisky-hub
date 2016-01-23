'use strict'
var isNumber = require('vigour-js/lib/util/is/number')

function getItem (req, hub) {
  var path = req.url
  if (path && path !== '/') {
    path = path.replace(/\/$/, '')
    hub = hub.get(path.split('/').slice(1))
  }
  return hub
}

exports.serverLogger = function (req, res) {
  var hub = getItem(req, this.getRoot())
  var ret
  if (hub && hub.serialize) {
    ret = hub.serialize()
  } else if (typeof hub === 'string' || isNumber(hub)) {
    ret = hub
  } else if (hub === null) {
    ret = 'null'
  } else if (typeof hub === 'object') {
    try {
      ret = JSON.stringify(hub, false, 2)
    } catch (e) {
      ret = e.message
    }
  } else {
    ret = 'undefined'
  }
  if (typeof ret === 'object') {
    res.end(JSON.stringify(ret, false, 2))
  } else {
    res.end(ret)
  }
}

// make hub getter property
exports.serverDebug = function (req, res) {
  var hub = this.getRoot()
  var item = getItem(req, hub)
  var target
  if (item) {
    // add keys etc all methods
    if (!item._path) {
      target = req.url
    } else {
      target = item.path.join('.')
      if (!target) {
        target = '$HUB'
      }
    }
  } else {
    target = '$HUB'
  }
  res.write('TARGET[' + target + ']')

  res.write('\n\n' + this.lookUp('adapter').parent.keys().join('\n  '))
  res.write('\n\nsubs listeners:')
  res.write(' \n total:' + exports.countListeners(item || hub, res))
  res.write('\n----------------------------------\n')
}

exports.countListeners = function (obs, res) {
  if (!res) {
    res = {write: function (val) {
      console.log(val)
    }}
  }
  var cnt = 0
  if (obs._on && obs._on.data && obs._on.data.attach) {
    cnt++
    res.write('\n>>>>  attach hit!: ---> ' + obs.path.join('.'))
    for (var i in obs._on.data.attach) {
      if (typeof i !== 'string' || i[0] !== '_' && !/(key|noContext)/.test(i)) {
        res.write('\n   ' + i)
      }
    }
  }
  obs.each((p, key) => {
    cnt += exports.countListeners(p, res)
  })
  return cnt
}
