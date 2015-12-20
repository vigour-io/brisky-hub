'use strict'
var Observable = require('vigour-js/lib/observable')

module.exports = new Observable({
  inject: [
    require('vigour-js/lib/methods/setWithPath'),
    require('vigour-js/lib/methods/serialize'),
    require('vigour-js/lib/methods/map'),
    require('vigour-js/lib/methods/keys'),
    require('vigour-js/lib/methods/toString'),
    require('vigour-js/lib/observable/is'),
    require('./on'),
    require('./scope'),
    require('./reference'),
    require('./get'),
    require('./level')
  ],
  ChildConstructor: 'Constructor'
}).Constructor
