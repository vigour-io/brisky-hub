process.stdout.write('\033c') //eslint-disableore-line
console.log('start!')
'use strict'
var Hub = require('../../lib')
// var _sc
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
  autoRemoveScopes: false,
  scope (scope, event, getScope) {
    //this, scope, event, getScope
    var init
    if (!this._scopes || !this._scopes[scope]) {
      init = true
    }
    var ret = getScope.apply(this, arguments)
    if( init) {
      console.log('init!', scope)
      ret.set({
        user: {
          name: scope
        }
      }, false)
    }
    return ret
  }
})

hub.set({
  shows: {},
  discover: {
    carousel: {},
    lists: {
      free: {},
      popular: {},
      recommended: {},
      new: {}
    }
  },
  channels: {},
  levelready: true
}, false)

hub.adapter.websocket.server.val = 3031

hub.levelready.is(true, function () {
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
        res.pipe(JSONStream.parse('mtvData.NL.en.channels.*'))
          .on('data', function (data) {
            if (data.id) {
              // console.log('channel from json:', data.id, data)
              hub.channels.set({
                [data.id]: data
              })
              hub.channels[data.id].set({
                currentEpisode: hub.channels[data.id],
                epg: {
                  0: {
                    title: 'Dumb people unite',
                    subtitle: '20:00 - 21:00'
                  },
                  1: {
                    title: 'Friendly people unite',
                    subtitle: '21:00 - 22:00'
                  },
                  2: {
                    title: 'Shine flame',
                    subtitle: '21:00 - 22:00'
                  }
                }
              })
              if (!hub.channels.focus) {
                hub.channels.setKey('focus', hub.channels.firstChild())
              }
            } else {
              // console.log('channel from json --> no id:'.red, data)
            }
          })

        // load shows
        var showCount = 0
        res.pipe(JSONStream.parse('mtvData.NL.en.shows.*'))
          .on('data', function (data) {
            if (data.id) {
              console.log('show from json:', data.id, data.img)
                // event ofc
              data.index = showCount++
              hub.shows.set({
                [data.id]: data
              })

              hub.shows[data.id].set({
                currentEpisode: hub.shows[data.id].seasons[0].episodes[0],
                currentSeason: hub.shows[data.id].seasons[0]
              })
              hub.shows[data.id].seasons.each((season) => {
                season.episodes.each((episode) => {
                  episode.set({
                    time: Math.random(),
                    video: episode.mrss.val
                  })
                })

                season.episodes.setKey('focus', season.episodes.firstChild())
              })
              if (!hub.shows.focus) {
                hub.shows.setKey('focus', hub.shows.firstChild())
              }
            } else {
              console.log('show from json --> no id:', data)
            }
          })
          // load discover
        res.pipe(JSONStream.parse('mtvData.NL.en.discover_marquee_premium.list.*'))
          .on('data', function (data) {
            // show or channel etc
            var link = data.link && data.link.split('.')
            if (link) {
              var length = link.length
              var id = link[length - 1]
              hub.discover.carousel.set({
                [id]: hub.get(link.slice(3, length), {})
              })
              if (!hub.discover.carousel.focus) {
                hub.discover.carousel.setKey('focus', hub.get(link.slice(3, length), {}))
              }
            }
          })

        res.pipe(JSONStream.parse('mtvData.NL.en.discover_marquee_free.list.*'))
          .on('data', function (data) {
            // show or channel etc
            var link = data.link && data.link.split('.')
            if (link) {
              var length = link.length
              var id = link[length - 1]
              hub.discover.lists.free.set({
                [id]: hub.get(link.slice(3, length), {})
              })
              if (!hub.discover.lists.free.focus) {
                hub.discover.lists.free.setKey('focus', hub.get(link.slice(3, length), {}))
              }
            }
          })

        res.pipe(JSONStream.parse('mtvData.NL.en.discover_row1_free.list.*'))
          .on('data', function (data) {
            // show or channel etc
            var link = data.link && data.link.split('.')
            if (link) {
              var length = link.length
              var id = link[length - 1]
              hub.discover.lists.popular.set({
                [id]: hub.get(link.slice(3, length), {})
              })
              if (!hub.discover.lists.popular.focus) {
                hub.discover.lists.popular.setKey('focus', hub.get(link.slice(3, length), {}))
              }
            }
          })

        res.pipe(JSONStream.parse('mtvData.NL.en.discover_row2_free.list.*'))
          .on('data', function (data) {
            // show or channel etc
            var link = data.link && data.link.split('.')
            if (link) {
              var length = link.length
              var id = link[length - 1]
              hub.discover.lists.recommended.set({
                [id]: hub.get(link.slice(3, length), {})
              })
              if (!hub.discover.lists.recommended.focus) {
                hub.discover.lists.recommended.setKey('focus', hub.get(link.slice(3, length), {}))
              }
            }
          })

        res.pipe(JSONStream.parse('mtvData.NL.en.discover_row3_free.list.*'))
          .on('data', function (data) {
            // show or channel etc
            var link = data.link && data.link.split('.')
            if (link) {
              var length = link.length
              var id = link[length - 1]
              hub.discover.lists.new.set({
                [id]: hub.get(link.slice(3, length), {})
              })
              if (!hub.discover.lists.new.focus) {
                hub.discover.lists.new.setKey('focus', hub.get(link.slice(3, length), {}))
              }
            }
          })
        .on('end', function () {
          console.log('!!!!JSON READY!!!!')
          hub.set({ 'datafromjson': true })
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

})