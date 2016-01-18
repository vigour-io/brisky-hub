'use strict'
var Hub = require('../../lib')
var hub = global.hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket')
    // websocket: {}
  },
  textfield: 'nothing yet',
  shows: {},
  codes: {}
})

// hub.adapter.scope.val = 'anon'
hub.adapter.set({ websocket: 'ws://localhost:3031' })

var Element = require('vigour-element')
var app = require('vigour-element/lib/app')

app.set({
  codesbtn: {
    type: 'button',
    text: 'add codes',
    on: {
      click () {
        hub.set({
          codes: {
            //Math.random() * 9999
            // Math.random() * 9999
            [Math.round(Math.random()*999999)]: {
              val: true
            }
          }
        })
      }
    }
  },
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
  codes: {
    $collection: true,
    ChildConstructor: new Element({
      text: { $: true }
    })
  },
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
  },
  col: {
    $collection: true,
    ChildConstructor: new Element({
      text: {
        $: 'title'
      }
    })
  }
})

app.holder.val = hub
app.col.val = hub.shows
app.codes.val = hub.codes

// setTimeout(function () {
//   hub.set({
//     shows: {
//       [Math.random() * 9999]: {
//         title: 'yoyoyo'
//       }
//     }
//   })
// }, 100)
// for the multi-upstreams multi-scope we do need to apply subscriptions to the original -- pretty annoying
// other fix just add extension capability for this all subs on scopes also go to original: true
