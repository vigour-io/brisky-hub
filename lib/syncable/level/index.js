'use strict'
var colors = require('colors-browserify') //eslint-disable-line
// use level-js -- both browser and node thing!
var levelup = require('levelup')
var Event = require('vigour-js/lib/event')
var setWithPath = require('vigour-js/lib/util/setwithpath')
var leveljs = require('level-js')
var leveldown
try {
  leveldown = require('leveldown')
} catch (e) {
  console.error(e)
}
var Observable = require('vigour-js/lib/observable')
// need to install leveldown

// console.log('level it!'.rainbow)


// use same parse function -- see it as an upstream? dont store upstream no!
exports.properties = {
  // also do scopes
  levelready: new Observable({
    inject: require('vigour-js/lib/observable/is')
  }),
  levelup (val) {
    if (this.levelup) {
      console.log('destroy!')
    }
    if (!val) {
      val = this.get('adapter.id', 'hub')
    }
    var hub = this
    this.set({ levelready: false })

    var event = new Event(hub, 'level')
    event.isTriggered = true
    // correct path put in folder
    var db = this.levelup = levelup('level-' + val, { db: leveldown || leveljs })
    db.open(function onOpen () {
      var r = db.createReadStream()
      r.on('data', function (data) {
        // write to correct hub
        var obj = setWithPath({}, data.key.split('.'), data.value)
        hub = hub.set(obj, event) || hub
        // hub.get(data.key, {}).set(data.value, event)
        console.log(data.key, '=', data.value)
      })
      .on('error', function (err) {
        hub.levelready.val = true
        console.log('Oh my!', err)
      })
      .on('close', function () {
        hub.levelready.val = true
        console.log('Stream closed')
      })
      .on('end', function () {
        event.trigger()
        hub.levelready.val = true
        console.log('Stream closed')
      })
      console.log('level times!'.blue)
    })
  }
}

// make a queue object
exports.on = {
  data: {
    level (data, event) {
      if (event.type === 'level') {
        return
      }
      var db = this.lookUp('levelup') // until you find it
      // level db path
      if (db && this.syncPath[0] !== 'clients') {
        if (typeof data !== 'object') {
          db.put(this.syncPath.join('.'), data, () => {
            console.log('wrote to level--->'.blue, data)
          })
        } else if (data === null) {
          db.del(this.syncPath.join('.'), function () {
            console.log('remove from level--->'.red, data)
          })
        }
        // if data null -- also remove all bested fields!
      }
      // console.log('level >'.grey, this.path.join('.'), db)
    }
  }
}
