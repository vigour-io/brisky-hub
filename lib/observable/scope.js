'use strict'
exports.properties = {
  _scopes: true
}

exports.define = {
  scopes (scope, event) {
    if (!(this._scopes && this._scopes[scope])) {
      if (!this._scopes) {
        // moet per adapter!
        this._scopes = {}
      }
      console.log('create a scope!', scope)
      this._scopes[scope] = new this.Constructor({ scope: scope }, false)
    }
    return this._scopes[scope]
  }
}

exports.properties = {
  scope: function (val) {
    if (!this.scopes) {
      Object.getPrototypeOf(this)._scopes = {}
    }
    this.scope = val
    this._scopes[val] = this
  }
}
