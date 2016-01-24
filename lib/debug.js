'use strict'
var isNumber = require('vigour-js/lib/util/is/number')

function getItem (url, hub) {
  var path = url
  if (path && path !== '/') {
    path = path.replace(/(^\/)|(\/$)/g, '')
    hub = hub.get(path.split('/'))
  }
  return hub
}

exports.serverLogger = function (req, res) {
  var hub = getItem(req.url, this.getRoot())
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
  var url = req.url
  var hub = this.getRoot()
  if (url === '/scopes') {
    res.write('SCOPES:')
    res.write('\n  ' +
      Object.keys(hub._scopes)
      .join('\n  ')
    )
    res.write('\n')
    // return
  } else if (url.indexOf('/_scopes/') === 0) {
    url = url.replace('!', '#')
  } else {
    if (hub.scope) {
      hub = Object.getPrototypeOf(hub)
    }
  }
  try {
    var item = getItem(url, hub)
    var target
    if (item) {
      // add keys etc all methods
      if (!item._path) {
        target = url + (item.scope || ' ~ ')
      } else {
        target = item.path.join('.')
        if (!target) {
          target = '$HUB ' + (hub.scope || ' ~ ')
        }
      }
      if (item._context) {
        res.write('in context: ' + item._contextLevel + ' ' + item._context.path.join('.'))
      }
    } else {
      target = '$HUB ' + (hub.scope || ' ~ ')
    }
    res.write('TARGET [' + target + ']')
    res.write('\nREAL   [' + realScope(item || hub) + ']')

    if (item) {
      res.write('\n' +
        (typeof item === 'object'
          ? item.setKeyInternal
            ? '[Observable "' + (typeof item.val !== 'object' ? item.val : '') + '"]'
            : JSON.stringify(item, false, 2)
          : item) + ' '
      )
    }

    res.write('\n\n  ' +
      (item || hub).keys()
        .filter((val) =>
          val !== 'trackInstances' &&
          val !== 'overrides' &&
          val !== 'autoRemoveScopes' &&
          val !== 'cachedSyncPath'
        )
        .join('\n  ')
    )
    res.write('\n\n' + 'subs listeners:\n' + indent(200, '', '-'))
    res.write(' \n total:' + exports.countListeners(item || hub, res))
    res.write('\n' + indent(200, '', '-') + '\n')
  } catch (e) {
    res.write('\n' + e.message + '\n')
  }
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
    var first = 'attach: ' + indent(60, obs.path.join('.'))
    var len = first.length
    // res.write()
    for (var i in obs._on.data.attach) {
      if (typeof i !== 'string' || i[0] !== '_' && !/(key|noContext)/.test(i) && obs._on.data.attach[i] !== null) {
        res.write('\n' + (first || indent(len)))
        first = false
        let client = obs._on.data.attach[i][1]
        res.write(
          ' client: ' + client.val +
          ' clientscope: ' + indent(10, client.scope || '~') +
          ' scope: ' + realScope(obs._on.data.attach, i) +
          ' key: ' + i
        )
      }
    }
  }
  obs.each((p, key) => {
    cnt += exports.countListeners(p, res)
  })
  return cnt
}

function indent (i, str, char) {
  if (str) {
    i = i - str.length
  } else {
    str = ''
  }
  if (!char) {
    char = ' '
  }
  while (i) {
    i--
    str += char
  }
  return str
}

function realScope (target, i) {
  var scope
  var lkey
  var otarget = target
  while (target) {
    if (lkey && !(target.hasOwnProperty('_' + lkey) || target.hasOwnProperty(lkey))) {
      return '~'
    }
    lkey = target.key
    if (target._scope) {
      scope = target._scope
      break
    }
    target = target._parent
  }

  if (scope) {
    if (!i || otarget.hasOwnProperty(i) || otarget.hasOwnProperty('_' + i)) {
      return indent(10, scope)
    }
  }
  return indent(10, '~')
}
