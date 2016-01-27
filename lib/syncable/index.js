'use strict'
var Observable = require('vigour-js/lib/observable')
var setWithPath = require('vigour-js/lib/util/setwithpath')
var Syncable
var Event = require('vigour-js/lib/event')
Syncable = module.exports = new Observable({
  define: {
    generateConstructor () {
      return function Syncable (val, event, parent, key, escape) {
        Observable.apply(this, arguments)
        if (this._on && this._on.data && this._on.data.base) {
          if (this.scope) {
            var trigger
            for (var i in this._on.data.base) {
              if (this._on.data.base[i] instanceof Syncable) {
                var hub = this.hub
                let bla = this._on.data.base[i]
                if (!event) {
                  event = new Event('data')
                  trigger = true
                }
                if (event) {
                  event.on('close', () => {
                    if (hub._input !== null) {
                      let field = hub.get(bla.syncPath, {})
                      if (field._input !== null) {
                        if (this._input !== null) {
                          field.set(this, false)
                        } else {
                          field.set(void 0, false)
                        }
                      }
                    }
                  })
                }
                console.log('have to ref my own resolve them ALL!', i, this.path, this.scope, this._on.data.base[i].path)
              }
              if (trigger) {
                setTimeout(() => event.trigger())
              }
            }
          }
        }
        return this
      }
    }
  },
  inject: [
    require('vigour-js/lib/methods/setWithPath'),
    require('vigour-js/lib/methods/serialize'),
    require('vigour-js/lib/methods/map'),
    require('vigour-js/lib/methods/keys'),
    require('vigour-js/lib/methods/toString'),
    require('vigour-js/lib/observable/is'),
    require('./on'),
    require('./scope'),
    require('./reference'),
    require('./get'),
    require('./subscription')
    // require('../level')
  ],
  properties: {
    noScope: true
  },
  ChildConstructor: 'Constructor'
}).Constructor

// so here we need to swiggle with generateConstructor
