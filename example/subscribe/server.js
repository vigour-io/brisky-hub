require('colors-browserify')
var Hub = require('../../lib')
var http = require('http')
var JSONStream = require('JSONStream')
var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    id: 'mtv',
    websocket: {
      server: 3031,
      // val: 'ws://youzi.local:3032'
    }
  },
  shows: {}
  // leveldb: 'mtv',
  // datafromjson: false
})

// hub.levelready.is(true, function () {
if (hub.get('shows.1138.seasons.10.episodes.0.title')) {
  console.log('shows.1138.seasons.10.episodes.0.title --->', hub.get('shows.1138.seasons.10.episodes.0.title').val)
}
if (!hub.datafromjson || hub.datafromjson.val !== true) {
  console.log('start loading!'.magenta)
  http.request({
    host: 'scraper.dev.vigour.io',
    path: '/new.json',
    port: 80,
    method: 'get',
    headers: {
      accepts: '*/*'
    }
  }, function (res) {
    res.pipe(JSONStream.parse('mtvData.*.*.shows.*'))
    .on('data', function (data) {
      console.log('hey hello'.blue, data)
      if (data.id) {
        hub.shows.set({ [data.id]: data })
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
