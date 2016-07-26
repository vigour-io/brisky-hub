'use strict'
const merge = require('lodash.merge')
const inprogress = {}
// const vstamp = require('vigour-stamp')

module.exports = function (client, state, type, stamp, subs, tree, sType) {
  const obj = {}
  const path = state.realPath(false, true)
  const id = client.id.compute()
  const len = path.length
  var select = obj
  for (let i = 0; i < len; i++) {
    select = select[path[i]] = {}
  }

  // console.log(select, state.stamp)
  if (state.val !== null) {
    if (state.val !== void 0) { select.val = state.val }
    select.stamp = state.stamp
  }
  // console.log('   -', state, state.stamp, id)

  console.log(' \n' + id)
  console.log(JSON.stringify(obj, false, 2))
  console.log(' \n')
  // select =
  // need to check for id again

  // serialize is totally wrong
  // select[path[len]] = state.val
  // need references as well
  // select[path[len]] = state.serialize()

  if (!inprogress[id]) {
    inprogress[id] = {}
    process.nextTick(() => {
      // make sure client is still connected
      if (client.val !== null && client.connection) {
        client.connection.send(JSON.stringify({
          state: inprogress[id],
          stamp: stamp
        }))
      }
      delete inprogress[id]
    })
  }

  merge(inprogress[id], obj)
}
