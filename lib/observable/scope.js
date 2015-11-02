'use strict'

// what do we need?
// -1 a listener on new
// -2 mixNmerge
// -3 instancesId in adapter replace hub contents with instance ids
// -4 adapter instance request resolver

/*
  -- scraper
  -- client
  -- main

  -- scraper
    instances for languages -- add field instanceId
 */

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
     // scopes
     // need to be able to add special rules
     // content hub to client -- creation rules e.g scrtaper doing DE.nl
     // main hubs DE.nl.USERID
     // for now just return from instance map
     // merger in here? -- a merger is only nessecary on req so should be fine
     // when instance in client in adapter add this client to the new adapter -- clients are for now inherited
     // we skip them out later -- just look for client instance
  }
}

exports.properties = {
  scope: function (val) {
    // here we need to find the original and add to instanceMap
    // dont add instance map on orig but do add it to the first level of instance
    // get origin -1 or add map first time you set instance id then share!
    // console.log('ok instanceId!', val)
    if (!this.scopes) {
      Object.getPrototypeOf(this)._scopes = {}
    }
    this.scope = val
    this._scopes[val] = this
  }
}
