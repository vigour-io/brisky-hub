'use strict'
require('./style.less')
var Hub = require('../../lib')
var hub = global.hub = new Hub()

hub.set({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3031'
  }
})

var Observable = require('vigour-js/lib/observable')
 var a = new Observable({
  text: {
    on: {
      data (data, event) {
        console.log(data, event)
      }
    }
  }
})

// console.clear()
a.text.val = 'xxxxx'
// why not why not o why not!

var Element = require('vigour-element')
var Prop = require('vigour-element/lib/property')
var app = require('vigour-element/lib/app')

var bla = new Element({
  $: true,
  text: { $: 'text' }
})

app.set({
  bla: new bla.Constructor()
})

app.bla.val = hub



// var currentEpidose
var C = new Element({
  nested2: {
    title: { text: { $: 'title' } },
    trivia: {
      text: { $: 'meta.trivia' }
    },
    switchSeason: {
      $: 'currentSeason',
      type: 'button',
      text: { $add: ' season', $: 'number' },
      // text: { $add: ' season', $: 'currentSeason.number' }, //path over ref DOES not work NEED FIX NEED FIX FASH FASH FASH!
      on: {
        click () {
          console.clear()
          var origin = this.parent.parent.parent.parent.origin
          var current = origin.currentSeason.origin
          var seasons = origin.seasons
          var keys = []
          var index = 0
          seasons.each((p, k) => {
            keys.push(k)
            if (k === current.key) {
              index = keys.length - 1
            }
          })
          var nextKey = (keys[++index] || keys[0])
          origin.currentSeason.val = origin.seasons[nextKey]
        }
      }
    },
  // }
    // subscription from operators
    currentEpisode: {
      $: 'currentEpisode',
      title: {
        text: { $prepend: 'current episode (showlvl):', $: 'number' }
      }
    },
    currentSeason: {
      $: 'currentSeason',
      title: {
        text: { $: 'number' }
      },
      episodes: {
        type: 'ul',
        $collection: 'episodes',
        ChildConstructor: new Element({
          type: 'li',
          text: { $: 'number' },
          bla: {
            title: {
              text: {
                // setKey < setItem
                // nextItem, prevItem
                // add order as well
                $: 'focus', // this is going to be something special -- that does al the listening etc
                $transform (val) {
                  return val === true ? 'FOCUS!' : 'no focus!'
                }
              }
            }
          }
        })
      }
    },
    seasons: {
      ChildConstructor: new Element({
        css: 'season',
        text: {
          $: 'number',
          $transform (val) { return val || this.origin.key } // does not work yet
        }, // also make possible to use things like 'key' going to be sweety ballz
        episode: {
          title: {
            $: null,
            text: 'currentEpisode'
          },
          epi: {
            $: 'currentEpisode',
            text: { $: 'number' },
            nextEpisode: {
              type: 'button',
              text: 'nextEpisode',
              on: {
                click () {
                  console.clear()
                  var current = this.parent._input
                  var origin = this.parent.parent.parent.origin
                  var episodes = origin.episodes
                  var keys = []
                  var index = 0
                  episodes.each((p, k) => {
                    keys.push(k)
                    if (k === current.key) {
                      index = keys.length - 1
                    }
                  })
                  var nextKey = (keys[++index] || keys[0])

                  origin.currentEpisode.origin.set({ focus: false })
                  origin.currentEpisode.val = episodes[nextKey]
                  episodes[nextKey].set({ focus: true })
                  origin.parent.parent.currentEpisode.val = episodes[nextKey]
                  currentEpisode.val = episodes[nextKey]
                }
              }
            }
          }
        },
        episodes: {
          ChildConstructor: new Element({
            properties: {
              focus: new Prop({
                inject: require('vigour-js/lib/operator/type'),
                render (node) {
                  // console.log()
                  node.style.border = this.val === true ? '1px solid red' : 'none'
                }
              })
            },
            focus: { $: 'focus' },
            // want to select current episode currently totally not doable...
            // merging 2 data sources in same mysterious way
            // what about using the power of parent for this?
            text: { $: 'number' }
          }),
          $collection: 'episodes'
        }
      }),
      $collection: 'seasons' // if it can find
    }
  }
}).Constructor

var A = new Element({
  text () { return this.parent.key },
  nested1: new C()
}).Constructor

var Page = new Element({
  css: 'page',
  text: 'page',
  $: true,
  a: new A(),
  b: new A() // { bla: new Title() }
  // show:new Show(),
  // another:new Show()
}).Constructor

var show = global.show =  hub.get('shows.1', {
  title: 'show',
  currentSeason: {},
  seasons: {
    1: {
      currentEpisode: {},
      number: 1,
      episodes: {
        1: { number: ' 1.1.1', description: 'description 1' },
        2: { number: ' 1.1.2', description: 'description 2', title: 'this is title 1.1.2' }
      }
    },
    2: {
      currentEpisode: {},
      currentSeason: {},
      number: 2,
      episodes: {
        1: { number: ' 1.2.1', description: 'description 1' },
        2: { number: ' 1.2.2', description: 'description 2' }
      }
    }
  }
})

var show2 = hub.get('shows.2', {
  title: 'show 2',
  currentSeason: {},
  meta: {
    trivia: 'did you know this is [SHOW2]'
  },
  seasons: {
    1: {
      currentEpisode: {},
      number: 1,
      episodes: {
        1: { number: ' 2.1.1', description: 'description 1' },
        gurk: { number: ' 2.1.gurk', description: 'description gurk' },
        smurk: { number: ' 2.1.smurk', description: 'description smurk' },
        2: { number: ' 2.1.2', description: 'description 2', title: 'this is title 2.1.2' }
      }
    },
    2: {
      currentEpisode: {},
      currentSeason: {},
      number: 2,
      episodes: {
        1: { number: ' 2.2.1', description: 'description 1' },
        2: { number: ' 2.2.2', description: 'description 2' }
      }
    }
  }
})

// show2.seasons[1].currentEpisode.val = {
//   number: '!!!!!'
// }

var currentEpisode = new Observable()

show.set({ currentEpisode: show.seasons[1].episodes[1]})

show2.set({ currentEpisode: show2.seasons[1].episodes.gurk})

show2.seasons[1].currentEpisode.val = show2.seasons[1].episodes.gurk
show2.currentSeason.val = show2.seasons[1]

show.seasons[1].currentEpisode.val = show.seasons[1].episodes.gurk
show.currentSeason.val = show.seasons[1]

// var show = hub.get('show', {

// })
// var show2 = hub.get('show2', {})

app.set({
  switchpage: {
    type: 'button',
    text: 'switch page',
    on: {
      click () {
        console.clear()
        var page = this.parent.switcher.page
        page.val = (page.origin === show ? show2 : show)
      }
    }
  },
  switcher: {
    page: new Page(show2)
  }
})
