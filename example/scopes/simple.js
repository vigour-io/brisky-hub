'use strict'
var Hub = require('../../lib')
var hub = global.hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    // websocket: {}
    // textfield: 'nothing yet'
  }
})
// hub.adapter.scope.val = 'anon'
hub.adapter.set({ websocket: 'ws://localhost:3031' })
var Element = require('vigour-element')
var app = require('vigour-element/lib/app')

app.set({
  holder: {
    $: true,
    textfield: {
      $: 'shows.977.currentSeason',
      switch: {
        type: 'button',
        text: 'switch season',
        on: {
          click () {
            console.clear()
            console.log('how can this result in a godamn wrong event???')
            var akward = hub.shows[977]
            var cs = akward.currentSeason
            cs.val = cs._input.key == 0 ? akward.seasons.get([1], {}) : akward.seasons.get([0], {})
            console.log(cs._input, cs)
          }
        }
      },
      inputs: {
        type: 'input',
        value: {
          $: 'number'
        },
        on: {
          keyup (data, event) {
            this.value.origin.val = this.node.value
          }
        }
      }
    }
  }
})

app.holder.val = hub
// for the multi-upstreams multi-scope we do need to apply subscriptions to the original -- pretty annoying
// other fix just add extension capability for this all subs on scopes also go to original: true
