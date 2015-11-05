'use strict'
var Observable = require('vigour-js/lib/observable')
Observable.prototype.inject(require('vigour-js/lib/methods/serialize'))

module.exports = new Observable({
  inject: [
    require('vigour-js/lib/methods/setWithPath'),
    require('vigour-js/lib/methods/serialize'),
    require('vigour-js/lib/methods/map'),
    require('vigour-js/lib/methods/keys'),
    require('vigour-js/lib/methods/lookup'),
    require('vigour-js/lib/methods/toString'),
    require('./on'),
    require('./scope')
  ],
  ChildConstructor: 'Constructor'
}).Constructor
