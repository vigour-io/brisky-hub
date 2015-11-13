'use strict'
exports.properties = {
  _scopes: true
}

exports.define = {
  getScope (scope, event) {
    if (!(this._scopes && this._scopes[scope])) {
      if (!this._scopes) {
        // for each adapter
        this._scopes = {}
      }
      this._scopes[scope] = new this.Constructor({ scope: scope }, false)
    }
    return this._scopes[scope]
  }
}

exports.properties = {
  // this is just the scope id!
  scope: function (val) {
    if (!this.scopes) {
      Object.getPrototypeOf(this)._scopes = {}
    }
    this.scope = val
    this._scopes[val] = this
  }
}
