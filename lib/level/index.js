'use strict'
var colors = require('colors-browserify') //eslint-disable-line
// use level-js -- both browser and node thing!
var levelup = require('levelup')
var Event = require('vigour-js/lib/event')
var setWithPath = require('vigour-js/lib/util/setwithpath')
var leveldb = require('./db')
var merge = require('vigour-js/lib/util/merge')
var isNumberLike = require('vigour-js/lib/util/is/numberlike')
var Observable = require('vigour-js/lib/observable')
var isPlainObj = require('vigour-js/lib/util/is/plainobj')
var MAX_SET = 300
// make this a seperate npm module
exports.properties = {
  levelready: new Observable({
    inject: require('vigour-js/lib/observable/is')
  }),
  leveldb (val) {
    var maxSize = MAX_SET
    if (isPlainObj(val)) {
      maxSize = val.maxSets // make this hub based
      val = val.val
    }
    if (this.leveldb) {
      console.log('destroy!'.red)
    }
    if (!val) {
      val = this.get('adapter.id', 'hub')
    }
    var hub = this
    this.set({ levelready: false }) // make this better
    var event = new Event(hub, 'level')
    event.isTriggered = true
    // correct path put in folder
    var db = this.leveldb = levelup('level-' + val, { db: leveldb })
    db.open(function onOpen () {
      var r = db.createReadStream()
      var obj = {}
      var cnt = 0
      r.on('data', function (data) {
        // REUSE TYPE OPERATOR PARSING
        if (isNumberLike(data.value)) {
          data.value = Number(data.value)
        } else if (data.value === 'false') {
          data.value = false
        } else if (data.value === 'true') {
          data.value = true
        } else if (data.value === '$eMPt_') {
          data.value = ''
        }
        merge(obj, setWithPath({}, data.key.split('.'), data.value))
        cnt++
        if (cnt > maxSize) {
          hub = hub.set(obj, event) || hub
          event.trigger()
          event = new Event(hub, 'level')
          event.isTriggered = true
          obj = {}
          cnt = 0
        }
      })
      .on('error', function (err) {
        console.log('Oh my level errors! level', err)
        event.remove()
      })
      .on('close', function () {
        console.log('level Stream closed')
        event.remove()
      })
      .on('end', function () {
        hub = hub.set(obj, event) || hub
        event.trigger()
        hub.levelready.val = true
        console.log('level Stream RDY'.rainbow)
      })
    })
  }
}

// make a queue object
// add this on hub -- then inject it on ChildConstructor
exports.on = {
  data: {
    level (data, event) {
      if (event.type === 'level') {
        // check for event.stamp perhaps?
        return
      }
      // this is way to heavy and retarded make this thing injectable over chldconstructors
      // maybe make a thing for that?
      var db = this.lookUp('leveldb') // until you find it
      if (db && this.syncPath[0] !== 'clients') {
        if (typeof data !== 'object') {
          // console.log('level db put -->'.blue, this.syncPath.join('.'), data)
          if (data === '') {
            data = '$eMPt_'
          }
          db.put(this.syncPath.join('.'), data, () => {
            console.log('wrote to level--->'.blue, this.syncPath.join('.'), data)
          })
        } else if (data === null) {
          db.del(this.syncPath.join('.'), function () {
            // console.log('remove from level--->'.red, data)
          })
        }
      }
    }
  }
}

// make this smart --
