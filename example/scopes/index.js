'use strict'
var Hub = require('../../lib')
var hub = global.hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    // websocket: {}
  },
  textfield: 'nothing yet'
})

hub.adapter.scope.val = 'anon'
hub.adapter.set({ websocket: 'ws://localhost:3031' })

var Element = require('vigour-element')
var app = require('vigour-element/lib/app')

app.set({
  yuzi: new Element({
    id: {
      text: hub.adapter.id
    },
    text: { $prepend: 'scope: ', val: hub.adapter.scope },
    switcher: {
      type: 'button',
      text: 'switch it',
      on: {
        click () {
          console.log('yo switch it')
          this.parent.text.origin.val = hub.adapter.scope.val === 'james' ? 'yuz' : 'james'
        }
      }
    }
  }),
  holder: {
    $: true,
    textfield: {
      type: 'input',
      value: {
        $: 'textfield'
      },
      on: {
        keyup (data, event) {
          this.value.origin.val = this.node.value
        }
      }
    }
  }
})

app.holder.val = hub
// for the multi-upstreams multi-scope we do need to apply subscriptions to the original -- pretty annoying
// other fix just add extension capability for this all subs on scopes also go to original: true
