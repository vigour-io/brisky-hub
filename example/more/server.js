process.stdout.write('\033c') //eslint-disableore-line
console.log('start!')
'use strict'
var Hub = require('../../lib')
var fs = require('fs')
  // var colors = require('colors-browserify')
var http = require('http')
var JSONStream = require('JSONStream')
var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    id: 'mtv',
    websocket: {
      // val: 'ws://youzi.local:3032'
    }
  },
  shows: {
    977: {
      title: 'awkward',
      // currentSeason:
      seasons: {
        0: {
          number: 1,
          episodes: {
            0: {
              title: 'haha 0.0'
            },
            1: {
              title: 'haha 0.1'
            }
          }
        },
        1: {
          number: 2,
          episodes: {
            0: {
              title: 'haha 1.0'
            },
            1: {
              title: 'haha 1.1'
            }
          }
        }
      },
      img: 'yoyoy'
    }
  },
  discover: {
    carousel: {},
    lists: {
      free: {},
      recommended: {},
      popular: {},
      new: {}
    }
  },
  reffie: {
    title: 'reffie'
  },
  channels: {},
  // leveldb: 'mtv',
  datafromjson: true
})

hub.shows[977].set({
  currentSeason: hub.shows[977].seasons[0],
  currentEpisode: hub.shows[977].seasons[0].episodes[0]
})
  // hub.shows.set({
    // 3: hub.reffie
  // })

// var https = require('https')
if (!hub.datafromjson || hub.datafromjson.val !== true) {
  setTimeout(function () {
    // console.log('start loading!')
    var count = 0

    http.request({
      host: '37.48.93.74',
      path: '/new.json',
      port: 51004,
      method: 'get',
      headers: {
        accepts: '*/*'
      }
    }, function (res) {
      // load channels
      res.pipe(JSONStream.parse('mtvData.*.*.channels.*'))
        .on('data', function (data) {
          if (data.id) {
            // console.log('channel from json:', data.id, data)
            hub.channels.set({
              [data.id]: data
            })
            hub.channels[data.id].setKey('currentEpisode', hub.channels[data.id])
          } else {
            // console.log('channel from json --> no id:'.red, data)
          }
        })

      // load shows
      res.pipe(JSONStream.parse('mtvData.*.*.shows.*'))
        .on('data', function (data) {
          if (data.id) {
            console.log('show from json:', data.id, data.img)
              // event ofc

            hub.shows.set({
              [data.id]: data
            })

            hub.shows[data.id].set({
              currentEpisode: hub.shows[data.id].seasons[0].episodes[0],
              currentSeason: hub.shows[data.id].seasons[0]
            })

            hub.shows[data.id].seasons.each((p) => {
                p.episodes.each((p) => {
                  p.set({
                    time: Math.random()
                  })
                  p.set({
                      video: p.mrss.val
                    })
                    // if(p.mrss.val === 'c5cc5ef90b81d94e3fb0') {
                    //   console.log(p.title.val)
                    //   var MRSS =
                    // }
                })
              })
              // getImgBase64(hub.shows[data.id])

            // count++
            // if (count <= 3) {
            //   hub.discover.carousel.set({
            //     [data.id]: hub.shows[data.id]
            //   })
            // } else if (count <= 10) {
            //   hub.discover.lists.free.set({
            //     [data.id]: hub.shows[data.id]
            //   })
            // } else if (count <= 15) {
            //   hub.discover.lists.recommended.set({
            //     [data.id]: hub.shows[data.id]
            //   })
            // } else if (count <= 20) {
            //   hub.discover.lists.popular.set({
            //     [data.id]: hub.shows[data.id]
            //   })
            // } else if (count <= 25) {
            //   hub.discover.lists.new.set({
            //     [data.id]: hub.shows[data.id]
            //   })
            // }
          } else {
            // console.log('show from json --> no id:', data)
          }
        })
        // load discover

      res.pipe(JSONStream.parse('mtvData.*.*.discover_marquee_premium.list.*'))
        .on('data', function (data) {
          // show or channel etc
          var link = data.link && data.link.split('.')
          if (link) {
            var length = link.length
            var id = link[length - 1]
            hub.discover.carousel.set({
              [id]: hub.get(link.slice(3, length), {})
            })
          }
        })

      res.pipe(JSONStream.parse('mtvData.*.*.discover_marquee_free.list.*'))
        .on('data', function (data) {
          // show or channel etc
          var link = data.link && data.link.split('.')
          if (link) {
            var length = link.length
            var id = link[length - 1]
            hub.discover.lists.free.set({
              [id]: hub.get(link.slice(3, length), {})
            })
          }
        })

      res.pipe(JSONStream.parse('mtvData.*.*.discover_row1_free.list.*'))
        .on('data', function (data) {
          // show or channel etc
          var link = data.link && data.link.split('.')
          if (link) {
            var length = link.length
            var id = link[length - 1]
            hub.discover.lists.popular.set({
              [id]: hub.get(link.slice(3, length), {})
            })
          }
        })

      res.pipe(JSONStream.parse('mtvData.*.*.discover_row2_free.list.*'))
        .on('data', function (data) {
          // show or channel etc
          var link = data.link && data.link.split('.')
          if (link) {
            var length = link.length
            var id = link[length - 1]
            hub.discover.lists.recommended.set({
              [id]: hub.get(link.slice(3, length), {})
            })
          }
        })

      res.pipe(JSONStream.parse('mtvData.*.*.discover_row3_free.list.*'))
        .on('data', function (data) {
          // show or channel etc
          var link = data.link && data.link.split('.')
          if (link) {
            var length = link.length
            var id = link[length - 1]
            hub.discover.lists.new.set({
              [id]: hub.get(link.slice(3, length), {})
            })
          }
        })

      .on('end', function () {
        console.log('LOADED!')

        hub.setKey('datafromjson', true)

        hub.adapter.websocket.server.val = 3031
      })
    }).end()

  }, 1000)
} else {
  console.log('allready got data from the server')
  hub.adapter.websocket.server.val = 3031
}

var repl = require('repl')
repl.start('> ').context.hub = hub
