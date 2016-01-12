'use strict'
var Hub = require('../../lib')
var hub = global.hub = new Hub()

require('./style.less')

hub.set({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3031'
  },
  shows: {
    // 977: {

    // }
  }
})

var Element = require('vigour-element')
var Prop = require('vigour-element/lib/property')
var app = require('vigour-element/lib/app')

var A = new Element({
  $: true,
  text: { $: 'title' },
  button: {
    type: 'button',
    text: 'yo button',
    on: {
      click () {
        if (hub.blurf.origin === hub.blarf) {
          hub.blurf.val = false //.remove()
        } else {
          hub.set({'blarf': {
            title: 'its a blurf!'
          }})
          hub.blurf.val = hub.blarf
        }
      }
    }
  }
}).Constructor

var PAGE = new Element({
  $: 'shows', // so nested on collection listeners are rly fucked
  shows: {
    $collection: true,
    ChildConstructor: new Element({
      css: 'show',
      text: { $: 'title' },
      // image: {
      //   // url(data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7)
      //   $prepend: 'data:image/jpg;base64,',
      //   $: 'thumb'
      //   // val: 'R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7'
      // },
      seasons: {
        $collection: 'seasons',
        ChildConstructor: new Element({
          css: 'season',
          text: { $prepend: 'season: ', $: 'number' },
          episodes: {
            $collection: 'episodes',
            ChildConstructor: new Element({
              css: 'episode',
              text: { $: 'number' },
              // img: {
              //   type: 'img',
              //   src: {
              //     $: 'img',
              //     $transform (val) {
              //       if (typeof val === 'string') {
              //         var ret = `https://imgmtvplay-a.akamaihd.net/image/20/20?url=http://images.mtvnn.com/${val}/original`
              //         return ret
              //       }
              //       return
              //     }
              //   }
              // }
            })
          }
        })
      }
    })
  }
}).Constructor

app.set({
  c: new PAGE(hub),
  // b: new A(hub.get('blurf', {})),
  marcus: {
    text: 'lalala'
  }
})

hub.on(() => {
  console.log('incoming!')
  // console.time(1)
  // if (typeof window !== void 0) {
    // window.requestAnimationFrame(function () {
      // console.timeEnd(1)
    // })
  // }
})

module.exports = app
