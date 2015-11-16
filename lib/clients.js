'use strict'
var Observable = require('vigour-js/lib/observable')

exports.properties = {
  clients: new Observable({
    ChildConstructor: require('./client')
  }).Constructor
}
