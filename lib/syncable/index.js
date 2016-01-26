'use strict'
var Observable = require('vigour-js/lib/observable')
var setWithPath = require('vigour-js/lib/util/setwithpath')
var Syncable
var Event = require('vigour-js/lib/event')
Syncable = module.exports = new Observable({
  define: {
    generateConstructor () {
      return function Element (val, event, parent, key, escape) {
        var ret = Observable.apply(this, arguments)

        // var refs = []
        if (this._on && this._on.data && this._on.data.base) {
          if (this.scope) {
            var trigger
            for (var i in  this._on.data.base) {
              if (this._on.data.base[i] instanceof Syncable) {
                // console.log(Object.keys(this._on.data.base))
                var hub = this.getRoot()
                console.log(hub.scope)
                // setWithPath(hub, this._on.data.base[i].syncPath, {}, false)
                // console.log(field.scope, field._context, this.scope, field._input.scope, field.syncPath)
                // console.log(field._input === this)
                // if (this instanceof field._input.Constructor) {
                  // // console.log('ok ok oko ok!!!', field.path)
                  let bla = this._on.data.base[i]
                  // setTimeout(() => {
                  //   var field = hub.get(bla.syncPath, {})
                  //   field.set(this)
                  // }, 0)
                  if(!event) {
                    event = new Event('data')
                    trigger = true
                  }
                  if(event) {
                    event.on('close', () => {
                      let field = hub.get(bla.syncPath, {})
                      field.set(this)
                    })
                  } else {
                    console.log('no event???')
                  }

                  //what to do resolve all manualy???
                  // console.log(this.)

                // }
                // field._input = this
                // field.setValue(this, false)
                // if (field._context) {
                // field = field.set(['$'].concat(this._on.data.base[i].syncPath), false)
                // }
                console.log('have to ref my own resolve them ALL!', i, this.path, this.scope, this._on.data.base[i].path)
                // refs.push(field)
                // hub.set()
              }
              if (trigger) {
                setTimeout(() => event.trigger())
              }
            }
          }
        }

        // for (var i in refs) {
        //   var d
        //   if (this._on.data._context) {
        //     d = this._on.data.resolveContext()
        //   }
        //   d = this._on.data
        //   this._on.data.on(refs[i])
        //   console.log(this._on.data)
        //   // this.on(refs[i])
        // }
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
  ChildConstructor: 'Constructor'
}).Constructor

// so here we need to swiggle with generateConstructor