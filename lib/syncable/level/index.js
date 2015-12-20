'use strict'
var colors = require('colors-browserify')
// use level-js -- both browser and node thing!
var levelup = require('levelup')
var leveljs = require('level-js')

// need to install leveldown

console.log('level it!'.rainbow)

// var queue = []

// var db = leveljs('hub') //make htis for per hub
var db = levelup('foo', { db: leveljs })

db.open(function onOpen() {
  // do it on queue
  console.log('level times!'.blue)

  // level.


  db.put('name', 'xxx', function () {
    console.log('blurf')
  })
  // stream all data in hub? or try to get like ls -- no!
})

// make a queue object

exports.on = {
  data: {
    level (data) {

      console.log('level >'.grey, this.path.join('.'), db)
    }
  }
}
