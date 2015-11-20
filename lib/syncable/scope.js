'use strict'
exports.properties = {
  _scopes: true
}

exports.define = {
  getScope (scope, event) {
    if (!(this._scopes && this._scopes[scope])) {
      if (!this._scopes) {
        // for each adapter not only once -- think about nested fields etc
        this._scopes = {}
      }
      this._scopes[scope] = new this.Constructor(void 0, false)
    }
    return this._scopes[scope]
  }
}
