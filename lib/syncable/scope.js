'use strict'
var isPlainObj = require('vigour-js/lib/util/is/plainobj')
var Observable = require('vigour-js/lib/observable')
var _set = Observable.prototype.set

exports.properties = {
  _scopes: true,
  _scope: true,
  autoRemoveScopes: { val: true },
  _scopeProperties: new Observable({
    ChildConstructor: new Observable({
      define: {
        set (val) {
          if (isPlainObj(val)) {
            this._input = val
          } else {
            return _set.apply(this, arguments)
          }
        }
      }
    })
  }),
  scope (val) {
    // setter (and property)
    var type = typeof val
    if (type === 'function') {
      this.define({
        getScope (scope, event) {
          return val.call(this, scope, event, getScope)
        }
      })
    } else if (isPlainObj(val)) {
      this.set({ _scopeProperties: val }, false)
    }
  }
}

exports.define = {
  getScope: getScope,
  scope: {
    get () {
      // getter (and property)
      var _parent = this
      while (_parent) {
        if (_parent.adapter) {
          return _parent._scope
        }
        _parent = _parent.parent
      }
    }
  }
}

function getScope (scope, event) {
  // make sure this._scopes[scope] is not deleted!
  if (!(this._scopes && this._scopes[scope])) {
    if (!this._scopes) {
      this._scopes = {}
    }
    let scoped = this._scopes[scope] = new this.Constructor(void 0, false)
    scoped._scope = scope
    if (this._scopeProperties && this._scopeProperties[scope]) {
      let scopeDefinition = this._scopeProperties[scope]._input
      if (typeof scopeDefinition === 'function') {
        scopeDefinition.call(this, scoped, event)
      } else {
        scoped.set(scopeDefinition, event)
      }
    }
  }
  return this._scopes[scope]
}
