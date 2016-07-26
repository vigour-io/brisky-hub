'use strict'
const merge = require('lodash.merge')
const inprogress = {}

module.exports = function (client, state, type, stamp, subs, tree, sType) {
  // needs to be extended of course!
  // can also send more at once of course will happen shortly
  // on close etc etc
  var obj = {}
  var path = state.realPath(false, true)
  var select = obj
  var len = path.length - 1
  for (let i = 0; i < len; i++) {
    select = select[path[i]] = {}
  }

  // serialize is totally wrong
  // select[path[len]] = state.val
  // need references as well
  select[path[len]] = state.serialize()

  // not enough of course but getting somewhere at least!
  // if (state.val && state.val.isState) {
  //   select[path[len]] = '$root.' + path.join('.')
  // }

  // all has to be btached -- stamps are wrong like this

  // stamps need to be set per level
  // updates need ot be send base don subscirptions

  if (!inprogress[client.id]) {
    inprogress[client.id] = {}
    process.nextTick(function () {
      client.connection.send(JSON.stringify({
        state: inprogress[client.id],
        stamp: state.getRoot().stamp // not good of course...
      }))
      delete inprogress[client.id]
    })
  }

  merge(inprogress[client.id], obj)
}

// this requires the queue
