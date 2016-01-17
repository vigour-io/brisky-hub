'use strict'
// use level-js -- both browser and node thing!
var levelup = require('levelup')
var Event = require('vigour-js/lib/event')
var setWithPath = require('vigour-js/lib/util/setwithpath')
var leveldb = require('./db')
var merge = require('vigour-js/lib/util/merge')
var isNumberLike = require('vigour-js/lib/util/is/numberlike')
var Observable = require('vigour-js/lib/observable')
var isPlainObj = require('vigour-js/lib/util/is/plainobj')
var MAX_SET = 100
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
      console.log('destroy!')
    }
    if (!val) {
      val = this.get('adapter.id', 'hub')
    }
    var hub = this
    this.set({ levelready: false }) // make this better
    var event = new Event('level')
    // event.isTriggered = true
    // correct path put in folder
    var db = this.leveldb = levelup('level-' + val, { db: leveldb })
    db.open(function onOpen () {
      var r = db.createReadStream()
      var obj = {}
      var cnt = 0
      r.on('data', function (data) {
        if (!data.key) {
          return
        }
        var parse = data.key.split('|')
        var scope = parse[0]
        var scopedObj = (obj[scope] || (obj[scope] = {}))
        var scopedHub = scope === '_' ? hub : hub.getScope(scope)
        data.key = parse[1]
        if (typeof data.value === 'string' && data.value[0] === '$' && data.value[1] === '.') {
          let arr = data.value.split('.')
          let target = scopedObj
          let pathes = data.key.split('.')
          for (let n = 0; n < pathes.length; n++) {
            if (n === pathes.length - 1) {
              target[pathes[n]] = arr
            } else {
              target = (target[pathes[n]] || (target[pathes[n]] = {}))
            }
          }
        } else {
          if (isNumberLike(data.value)) {
            data.value = Number(data.value)
          } else if (data.value === 'false') {
            data.value = false
            // ref is also important!
          } else if (data.value === 'true') {
            data.value = true
          } else if (data.value === '$eMPt_') {
            data.value = ''
          }
          let target = {}
          setWithPath(target, data.key.split('.'), data.value)
          merge(scopedObj, target)
        }

        cnt++
        if (cnt > maxSize) {
          scopedHub = scopedHub.set(scopedObj, event) || scopedHub
          event.trigger()
          event = new Event('level')
          obj[scope] = {}
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
        for (var i in obj) {
          if (i === '_') {
            hub.set(obj[i], event)
          } else {
            hub.getScope(i).set(obj[i], event)
          }
        }
        // hub = hub.set(obj, event) || hub
        event.trigger()
        hub.levelready.val = true
        // console.log(JSON.stringify(hub.serialize(), false, 2))
        console.log('level Stream RDY')
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
        let scope = this.lookUp('_scope') || '_'
        if (data instanceof Observable) {
          let p = data.path
          p.unshift('$')
          db.put(scope + '|' + this.syncPath.join('.'), p.join('.'), () => {
            console.log('wrote REFERENCE to level--->', this.syncPath.join('.'), p)
          })
        } else if (typeof data !== 'object') {
          // console.log('level db put -->'.blue, this.syncPath.join('.'), data)
          if (data === '') {
            data = '$eMPt_'
          }
          db.put(scope + '|' + this.syncPath.join('.'), data, () => {
            console.log('wrote to level--->', this.syncPath.join('.'), data)
          })
        } else if (data === null) {
          db.del(scope + '|' + this.syncPath.join('.'), function () {
            // console.log('remove from level--->'.red, data)
          })
        }
      }
    }
  }
}

// make this smart --
