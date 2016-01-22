'use strict'

module.exports = function single (observable, key, hub, map, event, result, client) {
  console.log('single!', observable.path)
  var path = observable.syncPath
  hub.subscribe(path.length > 1 ? path : true, [
    function () {
      // this has to merge back in result etc
      console.log('listener!')
    },
    client
  ])

  // handle ref
  console.log('hello?', observable)
  result.val = observable._input
}
