'use strict'
const inprogress = {}
const serialize = require('../../serialize')

module.exports = function (client, state, type, stamp, subs, tree, sType) {
  if (subs.val === true) {
    const id = client.id.compute()
    if (!inprogress[id]) {
      inprogress[id] = {}
      process.nextTick(() => {
        // make sure client is still connected
        if (client.val !== null && client.connection) {
          // this stamp can be used to get info over totals
          // console.log(inprogress[id])
          client.connection.send(JSON.stringify({
            state: inprogress[id],
            stamp: stamp
          }))
        }
        delete inprogress[id]
      })
    }
    serialize(inprogress[id], state, type, stamp, subs, tree, sType, id)
  }
}
