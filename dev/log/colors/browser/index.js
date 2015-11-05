'use strict'
// pretty dirty but makes the colors module compatible with the browser
var map = exports.map = require('./map')
var log = console.log
var string = String.prototype
var Style = function (val, style) {
  this.val = val
  this.style = style
}
var style = Style.prototype

for (let key in map.colors) {
  define(key, 'color:' + map.colors[key] + ';')
}

for (let key in map.backgrounds) {
  define(key, 'background-color:' + map.backgrounds[key] + ';')
}

for (let key in map.styles) {
  define(key, convertToCss(map.styles[key]))
}

for (let key in map.extras) {
  define(key, convertToCss(map.extras[key]))
}

// messes up stack -- handle this in inject or something
console.log = function () {
  // parse colors
  var args = []
  for (let arg of arguments) {
    if (arg instanceof Style) {
      console.log('%c' + arg.val, arg.style)
    } else {
      args.push(arg)
    }
  }
  if (args.length) {
    log.apply(console, arguments)
  }
}

// util functions
function define (key, css) {
  Object.defineProperty(style, key, {
    get () {
      this.style = this.style + css
      return this
    }
  })
  Object.defineProperty(string, key, {
    get () {
      return new Style(this, css)
    }
  })
}

function convertToCss (obj) {
  let cssMap = obj
  let css = ''
  for (let style in cssMap) {
    css += style + ':' + cssMap[style] + ';'
  }
  return css
}
