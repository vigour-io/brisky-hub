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
      val: 'ws://localhost:3032'
    }
  },
  levelup: 'mtv'
  // datafromjson: false
})

hub.levelready.is(true, function () {
  if (!hub.datafromjson || hub.datafromjson.val !== true) {
    console.log('start loading!'.magenta)
    http.request({
      host:  'scraper.dev.vigour.io', //'scraper-de-staging.dev.vigour.io',
      path: '/new.json',
      port: 80,
      method: 'get',
      headers: {
        accepts: '*/*'
      }
    }, function (res) {
      res.pipe(JSONStream.parse('mtvData.*.*'))
      .on('data', function (data) {
        console.log('CHUNK!'.magenta)
        // make this atomic wat to heavy
        hub.set(data)
      })
      .on('end', function () {
        hub.setKey('datafromjson', true)
      })
    }).end()
  }
})
