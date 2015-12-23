var Observable = require('vigour-js/lib/observable')
var Element = require('vigour-element')
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

var app = new App({ //eslint-disable-line
  node: document.body,
  projectList: {
    inject: require('vigour-js/lib/operator/subscribe'),
    ChildConstructor: new Element({
      text: 'dsfsdf'
    }),
    $: 'projects'
  },
  val: data
})
