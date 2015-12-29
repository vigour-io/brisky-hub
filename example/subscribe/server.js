require('colors-browserify')
var Hub = require('../../lib')
var http = require('http')
var JSONStream = require('JSONStream')
var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    id: 'mtv',
    websocket: {
      server: 3031
      // val: 'ws://youzi.local:3032'
    }
  },
  shows: {},
  discover: {
    carousel: {},
    lists: {
      free: {},
      recommended: {},
      popular: {},
      new:{}
    }
  },
  channels: {}
  // leveldb: 'mtv',
  // datafromjson: false
})

// lastupdate poller
// abu dahbi whats updated?
//  this field -- load -- and set on the hub

if (!hub.datafromjson || hub.datafromjson.val !== true) {
  console.log('start loading!'.magenta)

  var count = 0

  http.request({
    host: 'scraper.dev.vigour.io',
    path: '/new.json',
    port: 80,
    method: 'get',
    headers: {
      accepts: '*/*'
    }
  }, function (res) {
    // load channels
    res.pipe(JSONStream.parse('mtvData.*.*.channels.*'))
    .on('data', function (data) {
      if (data.id) {
        console.log('channel from json:'.green, data.id)
        hub.channels.set({ [data.id]: data })
      } else {
        console.log('channel from json --> no id:'.red, data)
      }
    })

    // load shows
    res.pipe(JSONStream.parse('mtvData.*.*.shows.*'))
    .on('data', function (data) {
      if (data.id) {
        console.log('show from json:'.blue, data.id)
        hub.shows.set({ [data.id]: data })
        count++
        if (count <= 3) {
          hub.discover.carousel.set({
            [data.id]: data
          })
        } else if (count <= 10) {
          hub.discover.lists.free.set({
            [data.id]: data
          })
        } else if (count <= 15) {
          hub.discover.lists.recommended.set({
            [data.id]: data
          })
        } else if (count <= 20) {
          hub.discover.lists.popular.set({
            [data.id]: data
          })
        } else if (count <= 25) {
          hub.discover.lists.new.set({
            [data.id]: data
          })
        }
      } else {
        console.log('show from json --> no id:'.red, data)
      }
    })
    .on('end', function () {
      // console.log('LOADED!'.magenta)
      hub.setKey('datafromjson', true)
    })
  }).end()
} else {
  console.log('allready got data from the server')
}
// })
