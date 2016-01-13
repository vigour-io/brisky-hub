'use strict'

// process.stdout.write('\033c') //eslint-disableore-line
console.log('start!')
var Hub = require('../../lib')
var fs = require('fs')

var JSONStream = require('JSONStream')
var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    id: 'mtv',
    websocket: {}
  },
  shows: {},
  discover: {
    carousel: {},
    lists: {
      free: {},
      recommended: {},
      popular: {},
      new: {}
    }
  },
  channels: {}
  // leveldb: 'mtv',
  // datafromjson: false
})

var https = require('https')

function getImgBase64(show) {
  getImgBase64nest(show)
    // ff wat beter concurrency handlen
    // show.seasons.each((p) => {
    //   p.episodes.each(function (pr) {
    //     getImgBase64nest(pr)
    //   })
    // })
}

function getImgBase64nest(show) {
  console.log('lezzgo!', show.img && show.img.val)
  if (!show.img || !show.img.val) {
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
        show.set({
          thumb: str
        })
      }
    })
  }).end()
}

//var ret = `https://imgmtvplay-a.akamaihd.net/image/20/20?url=http://images.mtvnn.com/${val}/original`
console.log('here!')
if (!hub.datafromjson || hub.datafromjson.val !== true) {
  setTimeout(function () {
    console.log('start loading!'.magenta)

    var count = 0

    var res = fs.createReadStream(__dirname + '/sbs.json')
      // http.request({
      //   host: 'scraper.dev.vigour.io',
      //   path: '/new.json',
      //   port: 80,
      //   method: 'get',
      //   headers: {
      //     accepts: '*/*'
      //   }
      // }, function (res) {
      // load channels
    res.pipe(JSONStream.parse('channels.*'))
      .on('data', function (data) {
        if (data.id) {
          console.log('channel from json:'.green, data.id, data.img)
          hub.channels.set({
            [data.id]: data
          })
        } else {
          console.log('channel from json --> no id:'.red, data)
        }
      })

    // load shows
    res.pipe(JSONStream.parse('shows.*'))
      .on('data', function (data) {
        if (data.id) {
          // event ofc
          hub.shows.setKey(data.id.val, data)
          let show = hub.shows[data.id.val]
          let seasonCount = 1
          let episodeCount = 1
          show.seasons.each(function (season) {
            let cnt = 1
            if (!show.currentSeason) {
              show.setKey('currentSeason', season)
            }
            season.setKey('number', seasonCount++)
            season.episodes.each(function (episode) {
              //101706_ed3db47fa8a8f621fc56e05a669523ae
              //"dash": "https://s3-eu-west-1.amazonaws.com/sbs-storage-dev/output/101706_ed3db47fa8a8f621fc56e05a669523ae/101706.mpd"

              // hls:   https://s3-eu-west-1.amazonaws.com/sbs-storage-dev/output/104698_62f9febd21d06444f05e3ae7c7589a6d/m3u8s/104698.m3u8
              // mpd: https://s3-eu-west-1.amazonaws.com/sbs-storage-dev/output/104698_62f9febd21d06444f05e3ae7c7589a6d/mpds/104698.mpd
              if (!show.currentEpisode) {
                show.setKey('currentEpisode', episode)
              }
              episode.set({
                time: Math.random(),
                number: cnt++,
                video: 'https://s3-eu-west-1.amazonaws.com/sbs-storage-dev/output/104698_62f9febd21d06444f05e3ae7c7589a6d/{type}s/104698.{type}',
                // img: data.img.val
              })
              episodeCount++
            })
            show.set({
              seasonCount: seasonCount,
              episodeCount: episodeCount
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
        console.log('LOADED!'.magenta)

        hub.setKey('datafromjson', true)

        hub.adapter.websocket.server.val = 3032
      })
      // }).end()

  }, 1000)
} else {
  console.log('allready got data from the server')
}
