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
  scope (val) {
    // can be a bit better has something strange
    if (!this.scopes) {
      // this can become strange --- need to know it better usualy this is correct but needs to know if this is the normal implementation of the hub
      Object.getPrototypeOf(this)._scopes = {}
    }
    this.scope = val
    this._scopes[val] = this
  }
}
