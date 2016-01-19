process.stdout.write('\033c') //eslint-disableore-line
console.log('start!')
'use strict'
var Hub = require('../../lib')
var fs = require('fs')
var http = require('http')

// need to put login here
// require('mtv play?')

var JSONStream = require('JSONStream')
var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    id: 'mtv',
    websocket: {}
  },
  autoRemoveScopes: false,
  scope (scope, event, getScope) {
    //this, scope, event, getScope
    var init
    if (!this._scopes || !this._scopes[scope]) {
      init = true
    }
    var ret = getScope.apply(this, arguments)
    if (init) {
      //lets do the auth here
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
  codes: {},
  channels: {},
  levelready: true,
  codes: {},
  translations: {},
}, false)

hub.levelready.is(true, function () {
  // var https = require('https')
  if (!hub.datafromjson || hub.datafromjson.val !== true) {
    setTimeout(function () {
      console.log('start loading!')
      var count = 0
      // http.request({
      //   host: '37.48.93.74',
      //   path: '/new.json',
      //   port: 51004,
      //   method: 'get',
      //   headers: {
      //     accepts: '*/*'
      //   }
      // }, function (res) {
        // console.log('should be here', __dirname + '/sbs-data.json')
        var res = fs.createReadStream(__dirname + '/sbs-data.json')

        // load shows
        var showCount = 0
        res.pipe(JSONStream.parse('shows.*'))
          .on('data', function (data) {
            // console.log(data)
            // if (data.id) {
            //   console.log('show from json:', data.id, data.img)
            //     // event ofc
            //   data.index = showCount++

            //   console.log('serialize dat bitch', data)
            //   hub.shows.set({
            //     [data.id]: data
            //   })
            //   // hub.shows.set(a)

            //   var hubShow = hub.shows[data.id]
            //   var seasonKey = hubShow.seasonKey
            //   var firstSeason = hubShow.seasons.firstChild()
            //   var firstEpisode = firstSeason.episodes.firstChild()

            //   hub.shows[data.id].set({
            //     currentEpisode: firstEpisode,
            //     currentSeason: firstSeason
            //   })
            //   console.log(hub.shows[data.id].seasons)
            //   hub.shows[data.id].seasons.each((season, key) => {
            //     if(key === 'focus') {return}
            //     season.episodes.each((episode, key) => {
            //       if(key === 'focus') {return}
            //       episode.set({
            //         time: Math.random(),
            //         // video: episode.mrss.val
            //       })
            //     })

            //     season.episodes.setKey('focus', season.episodes.firstChild())
            //   })
            //   if (!hub.shows.focus) {
            //     hub.shows.setKey('focus', hub.shows.firstChild())
            //   }
            // } else {
            //   console.log('show from json --> no id:', data)
            // }
          })
          // load discover
        res.pipe(JSONStream.parse('shows.discover_marquee_free.*'))
          .on('data', function (data) {
            // console.log(data)
            // // show or channel etc
            // var link = data.link && data.link.split('.')
            // if (link) {
            //   var length = link.length
            //   var id = link[length - 1]
            //   hub.discover.carousel.set({
            //     [id]: hub.get(link.slice(3, length), {})
            //   })
            //   if (!hub.discover.carousel.focus) {
            //     hub.discover.carousel.setKey('focus', hub.get(link.slice(3, length), {}))
            //   }
            // }
          })

        res.pipe(JSONStream.parse('mtvData.NL.en.discover_marquee_free.list.*'))
          .on('data', function (data) {
            // show or channel etc
            // var link = data.link && data.link.split('.')
            // if (link) {
            //   var length = link.length
            //   var id = link[length - 1]
            //   hub.discover.lists.free.set({
            //     [id]: hub.get(link.slice(3, length), {})
            //   })
            //   if (!hub.discover.lists.free.focus) {
            //     hub.discover.lists.free.setKey('focus', hub.get(link.slice(3, length), {}))
            //   }
            // }
          })

        res.pipe(JSONStream.parse('mtvData.NL.en.discover_row1_free.list.*'))
          .on('data', function (data) {
            // show or channel etc
            // var link = data.link && data.link.split('.')
            // if (link) {
            //   var length = link.length
            //   var id = link[length - 1]
            //   hub.discover.lists.popular.set({
            //     [id]: hub.get(link.slice(3, length), {})
            //   })
            //   if (!hub.discover.lists.popular.focus) {
            //     hub.discover.lists.popular.setKey('focus', hub.get(link.slice(3, length), {}))
            //   }
            // }
          })

        res.pipe(JSONStream.parse('mtvData.NL.en.discover_row2_free.list.*'))
          .on('data', function (data) {
            // show or channel etc
            // var link = data.link && data.link.split('.')
            // if (link) {
            //   var length = link.length
            //   var id = link[length - 1]
            //   hub.discover.lists.recommended.set({
            //     [id]: hub.get(link.slice(3, length), {})
            //   })
            //   if (!hub.discover.lists.recommended.focus) {
            //     hub.discover.lists.recommended.setKey('focus', hub.get(link.slice(3, length), {}))
            //   }
            // }
          })

        res.pipe(JSONStream.parse('mtvData.NL.en.discover_row3_free.list.*'))
          .on('data', function (data) {
            // show or channel etc
            // var link = data.link && data.link.split('.')
            // if (link) {
            //   var length = link.length
            //   var id = link[length - 1]
            //   hub.discover.lists.new.set({
            //     [id]: hub.get(link.slice(3, length), {})
            //   })
            //   if (!hub.discover.lists.new.focus) {
            //     hub.discover.lists.new.setKey('focus', hub.get(link.slice(3, length), {}))
            //   }
            // }
          })
        var reslang = fs.createReadStream(__dirname + '/dictionary/lang_en.json')
        reslang.pipe(JSONStream.parse())
          .on('data', function (data) {
            hub.translations = data
            // process.exit(0)
          })
        .on('end', function () {
          console.log('!!!!JSON READY!!!!')
          hub.set({ 'datafromjson': true })
          hub.adapter.websocket.server.val = 3031
        })
      // }).end()
    }, 1000)
  } else {
    console.log('allready got data from the server')
    hub.adapter.websocket.server.val = 3031
  }

  var repl = require('repl')
  repl.start('> ').context.hub = hub

})