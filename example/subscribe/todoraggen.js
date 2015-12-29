// var Hub = require('../../lib') //eslint-disable-line
// var Element = require('vigour-element/lib/element')
'use strict'
var Observable = require('vigour-js/lib/observable')
// Observable.prototype.inject(require('vigour-js/lib/operator/subscribe'))
// var App = require('vigour-element/lib/app') //eslint-disable-line
// Element.prototype.inject(
//   require('vigour-element/lib/property/text'),
//   require('vigour-element/lib/property/css'),
//   require('vigour-element/lib/events')
// )
// var data = new Observable({
//   projects: { a: 'x', b: 'y' }
// })
global.thingTextVal = 0

// var app = new Element({ //eslint-disable-line
//   key: 'app',
//   node: document.body,
//   val: data
// })
var j = 1
var Event = require('vigour-js/lib/event')
// var Thing = new Element({
//   key: 'thing',
//   text () {
//     global.thingTextVal++
//     return this.parent._input
//   }
// }).Constructor
var cntr = 0
console.log('start')
var n = 1
console.time('create: ' + n)
// var holder = new Element({
//   key: 'myholder'
// })

// **************** THIS IS THE NEW ELEMENT FRAMEWORK *****************
var nodes = global.nodes = {}
var contextsNodes = global.contextsNodes = {}
var flatParse = require('vigour-js/lib/base').prototype.parseValue
var Prop = new Observable({
  trackInstances: true,
  on: {
    data: {
      prop () {
        var node = this.parent.getNode()
        if (node) {
          this.render(node)
        }
      }
    }
  },
  properties: {
    render (val) {
      this.define({
        render: val
      })
    }
  }
}).Constructor
// in perf 3 this is borken -- but also in the other one :/
var NewElement = new Observable({
  trackInstances: true,
  define: {
    getNode () {
      if (this._context) {
        let cnode = contextsNodes[this.uid]
        if (cnode) {
          return cnode[this._context.uid]
        }
      } else {
        return nodes[this.uid]
      }
    }
  },
  properties: {
    text: new Prop({
      render (node) {
        if (!node.__) {
          node.__ = document.createTextNode(flatParse.call(this))
          node.appendChild(node.__)
        } else {
          node.__.nodeValue = this.parseValue()
        }
      }
    }),
    css: new Prop({
      render (node) {
        node.className = this.parseValue()
      }
    }),
    src: new Prop({
      render (node) {
        node.src = this.parseValue()
      }
    }),
    type: true
  },
  useVal: true,
  ChildConstructor: 'Constructor'
}).Constructor

function createNode (observable, node) {
  var type = observable.type
  if (type) {
    if (type === 'text') {
      let str = flatParse.call(observable)
      if (typeof str !== 'string') {
        str = ''
      }
      return document.createTextNode(str)
    }
  } else {
    type = 'div'
  }
  return node ? node.cloneNode(true) : document.createElement(type && typeof type === 'string' ? type : 'div')
}

function walker (observable, parentNode) {
  var node = createNode(observable)
  // node.className = observable.key
  if (observable._context) {
    let cnode = contextsNodes[observable.uid]
    if (!cnode) {
      cnode = contextsNodes[observable.uid] = {}
    }
    cnode[observable._context.uid] = node
  } else {
    nodes[observable.uid] = node
  }
  observable.each(function (property, key) {
    walker(observable[key], node)
  }, function (property, key) {
    if (property instanceof Prop) {
      property.render(node)
    } else {
      return property instanceof NewElement
    }
  })
  parentNode.appendChild(node)
}

var App
if (!require('vigour-js/lib/util/is/node')) {
  App = new Observable({
    properties: {
      node: function (val) {
        this._node = val
      }
    },
    define: {
      setKey (key, val) {
        var ret = Observable.prototype.setKey.apply(this, arguments)
        if (val instanceof NewElement) {
          walker(val, this._node || document.body)
        }
        return ret
      }
    }
  }).Constructor
} else {
  App = new Observable({
    properties: {
      node: function (val) {
        this._node = val
      }
    },
    define: {
      serialize () {
        if (this.___cache) {
          return this.___cache
        }
        var obj = {}
        // for example
        var str = '<body>'
        walk(this, obj)
        str += '</body>'
        this.___cache = str
        return str
        function walk (obs, obj) {
          obs.each(function (prop, key) {
            if (key === 'text') {
              str += prop.val
            }
          }, function (prop) { return (prop instanceof Prop) })
          obs.each(function (prop, key) {
            var type = prop.type || 'div'
            obj[key] = {}
            str += '<' + type + ' class="' + (prop.css ? prop.css.val : key) + '"'
            if (prop.src) {
              str += ' src="' + prop.src.val + '"'
            }
            str += '>'
            walk(prop, obj[key])
            str += '</' + type + '>'
          })
        }
      },
      setKey (key, val) {
        var ret = Observable.prototype.setKey.apply(this, arguments)
        // if (val instanceof NewElement) {
        //   // walkerNode(val)
        // }
        return ret
      }
    },
    inject: require('vigour-js/lib/operator/transform'),
    $transform () {
      return this.serialize()
    }
  }).Constructor
}
// **************** THIS IS THING *****************
var app = new App()
// var str = new StringApp()

var Thing = new NewElement({
  text: function () {
    return this._context._input
  },
  img: {
    type: 'img',
    src: 'http://vignette1.wikia.nocookie.net/scarface/images/4/44/Tony_Montana.jpg/revision/latest/scale-to-width-down/300?cb=20120604034628&path-prefix=en'
  },
  css: 'titlex',
  bla: {
    text: function () {
      return this._context._input
    }
  },
  x: {
    text: function () {
      return this._context._input
    }
  },
  xx: {
    text: function () {
      return this._context._input
    }
  },
  xxx: {
    text: function () {
      return this._context._input
    }
  }
}).Constructor
var holder = new NewElement()
var event = new Event(holder, 'data')
for (let i = 0; i < n; i++) {
  console.clear()
  var a = new Observable(i)
  global[i] = a
  holder.setKey(i, new Thing({
    text: a,
    bla: {
      text: a
    },
    x: {
      text: a
    },
    xx: {
      text: a
    },
    xxx: {
      text: a
    }
  }, event), event)
}
event.trigger()
app.set({
  holder: holder
})

if (require('vigour-js/lib/util/is/node')) {
  var http = require('http')
  http.createServer(function (req, res) {
    var str = '<html>'
    str += '<link href="http://localhost:8104/bundle.css?$app=192.168.0.12:8104/example/subscribe/todoraggen.js" rel="stylesheet" type="text/css">'
    str += app.val
    str += '</html>'
    res.end(str)
  }).listen(3031)
} else {
  require('./style.less')
  console.time('nika')
  app.val
  console.timeEnd('nika')
  console.time('nika')
  app.val
  console.timeEnd('nika')
}

global.execInternal = 0
console.timeEnd('create: ' + n)
function loop () {
  // console.log('************ gun fire! ************ ')
  global.execInternal = 0
  global.trigger = 0
  global.contextLoop = 0
  global.parentCalls = 0
  global.text = 0
  global.thingTextVal = 0
  global.eventPush = 0
  cntr++ //eslint-disable-line
  j++
  for (var i = 0; i < n; i++) {
    global[i].set(i + j)  // = i + j
  }
  var ev = new Event()

  // Thing.prototype.text.emit('data', void 0, ev)
  ev.trigger()
  // console.log('***** [ execInternal: ' + global.execInternal + ' ] ******')
  // console.log('***** [ trigger: ' + global.trigger + ' ] ******')
  // console.log('***** [ contextLoop: ' + global.contextLoop + ' ] ******')
  // console.log('***** [ eventPush: ' + global.eventPush + ' ] ******')
  // console.log('***** [ parentCalls: ' + global.parentCalls + ' ] ******')
  // console.log('***** [ text: ' + global.text + ' ] ******')
  // console.log('***** [ textThing: ' + global.thingTextVal + ' ] ******')
  window.requestAnimationFrame(loop)
}
// app.setKey('holder', holder)
// app.setKey('holder', new holder.Constructor())
var last = 0

console.time('updates')
if (!require('vigour-js/lib/util/is/node')) {
  loop()
  // setInterval(function () {
  //   last = cntr
  //   cntr = 0
  //   console.clear()
  //   console.log(last / 5, 'fps')
  // }, 5000)
}
console.timeEnd('updates')
