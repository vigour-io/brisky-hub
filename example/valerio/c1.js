'use strict'
require('./style.less')

var Element = require('vigour-element')
Element.prototype.inject(
  require('vigour-element/lib/property/css'),
  require('vigour-element/lib/property/text')
)

var uikit = require('vigour-uikit')
var Hub = require('../../lib')
var log = require('../dev/utils').log

var c1 = new Hub({
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection () {
        log.info('-- C1 Connected ')
      },
      error (err, ev) {
        log.error('-- C1 Error ', [err.message])
      }
    }
  },
  clients: {
    on: {
      property (data, ev) {
        log.info('-- C1 Property ', [JSON.stringify(data)])
      }
    }
  },
  on: {
    data () {
      log.info('-- C1 Data ')
    }
  }
})

var TopBar = new uikit.Topbar({
  css: 'swagTopBar',
  header: new uikit.Header[2]()
}).Constructor

var InputGroup = new Element({
  css: 'input-group',
  label: new uikit.Label({
    node: 'span'
  }),
  input: new uikit.Input({
    node: 'input'
  })
}).Constructor

var app = new Element({
  node: document.body,
  topbar: new TopBar({
    header: {
      text: 'Client 01'
    }
  }),
  config: new Element({
    port: new InputGroup({
      label: {
        text: {
          val: 'Server port'
        }
      },
      input: {
        on: {
          input () {
            log.info('-- port: ', [this.node.value])
            c1.adapter.val = this.node.value
          }
        }
      }
    }),
    scope: new InputGroup({
      label: {
        text: {
          val: 'Scope'
        }
      },
      input: {
        on: {
          input () {
            log.info('-- Scope: ', this.node.value)
          }
        }
      }
    })
  })
})

exports.app = global.app = app
