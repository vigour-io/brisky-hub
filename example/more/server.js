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

var https = require('https')

function getImgBase64 (show) {
  getImgBase64nest(show)
  // ff wat beter concurrency handlen
  // show.seasons.each((p) => {
  //   p.episodes.each(function (pr) {
  //     getImgBase64nest(pr)
  //   })
  // })
}

function getImgBase64nest (show) {
  console.log('lezzgo!', show.img && show.img.val)
  if (!show.img|| !show.img.val) {
    return
  }
   https.request({
    host: 'imgmtvplay-a.akamaihd.net',
    path: '/image/4/4?url=http://images.mtvnn.com/' + show.img.val + '/original',
    port: 443,
    method: 'get',
    headers: {
      accepts: '*/*'
    }
  }, function (res) {
    var str = ''
    res.on('data', function (data) {
      str += data.toString('base64')
      // console.log('yo lil data', arguments)
    })
    res.on('end', function (err, data) {
      if (!err && str) {
        show.set({ thumb: str })
      }
    })
  }).end()
}

//var ret = `https://imgmtvplay-a.akamaihd.net/image/20/20?url=http://images.mtvnn.com/${val}/original`
console.log('here!')
if (!hub.datafromjson || hub.datafromjson.val !== true) {
  setTimeout(function () {
    console.log('start loading!')

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
          console.log('channel from json:', data.id, data)
          hub.channels.set({ [data.id]: data })
          hub.channels[data.id].setKey('currentEpisode', hub.channels[data.id])
        } else {
          console.log('channel from json --> no id:'.red, data)
        }
      })

      // load shows
      res.pipe(JSONStream.parse('mtvData.*.*.shows.*'))
      .on('data', function (data) {
        if (data.id) {
          console.log('show from json:', data.id, data.img)
          // event ofc

          hub.shows.set({ [data.id]: data })

          hub.shows[data.id].set({
            currentEpisode: hub.shows[data.id].seasons[0].episodes[0],
            currentSeason: hub.shows[data.id].seasons[0]
          })

          hub.shows[data.id].seasons.each((p) => {
            p.episodes.each((p) => {
              p.set({ time: Math.random() })
              p.set({ video: p.mrss.val })
            })
          })
          // getImgBase64(hub.shows[data.id])

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
          console.log('show from json --> no id:', data)
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
}
