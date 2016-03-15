'use strict'
var Observable = require('vigour-observable')
var SyncableCnstr
var Event = require('vigour-event')
SyncableCnstr = module.exports = new Observable({
  type: 'syncable',
  define: {
    generateConstructor () {
      return function Syncable (val, event, parent, key, escape) {
        Observable.apply(this, arguments)
        if (this._on && this._on.data && this._on.data.base) {
          if (this.scope) {
            var trigger
            for (var i in this._on.data.base) {
              if (this._on.data.base[i] instanceof SyncableCnstr) {
                var hub = this.hub
                let bla = this._on.data.base[i]
                if (!event) {
                  event = new Event('data')
                  trigger = true
                }
                if (event) {
                  event.on('close', () => {
                    if (hub.__input !== null) {
                      let field = hub.get(bla.syncPath, {})
                      if (field.__input !== null) {
                        if (this.__input !== null) {
                          field.set(this, false)
                        } else {
                          field.set(void 0, false)
                        }
                      }
                    }
                  })
                }
                // console.log('have to ref my own resolve them ALL!', i, this.path, this.scope, this._on.data.base[i].path)
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
    require('./on'),
    require('./scope'),
    require('./get')
  ],
  properties: {
    noScope: true
  },
  Child: 'Constructor'
}).Constructor

// so here we need to swiggle with generateConstructor
