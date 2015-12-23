var Observable = require('vigour-js/lib/observable')

var Element = require('vigour-element/lib/element')
Element.prototype.inject(
  require('vigour-element/lib/property/text')
)
var App = require('vigour-element/lib/app')

// var Header = require('../common/components/header/')
// var Projects = require('./components/projects')
// var Footer = require('../common/components/footer')
//
// app.set({
//   header: Header,
//   container: {
//     css: 'main',
//     projectsList: Projects
//   },
//   footer: Footer
// })

var data = new Observable({
  projects: { a: 'x', b: 'y' }
})

var Hub = require('../../lib')
// console.line = false

var client = global.client = new Hub({
  key: 'client',
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3031'
  }
  // projects: {
  //   a: {
  //     title: 'xxx'
  //   }
  // }
})
//
// data.subscribe({
//   a: true
// })

var app = new Element({ //eslint-disable-line
  key: 'app',
  node: document.body,
  projectList: {
    xx: {},
    text: 'projects',
    inject: require('vigour-js/lib/operator/subscribe'),
    ChildConstructor: new Element({
      text: {
        $: 'title'
      }
    }),
    $: 'projects'
  },
  val: client
})

client.set({
  projects: {
    b: {
      title: 'xxxx'
    }
  }
})
