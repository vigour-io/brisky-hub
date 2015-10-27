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
  instance: function (val) {
    // here we need to find the original and add to instanceMap
    // dont add instance map on orig but do add it to the first level of instance
    // get origin -1 or add map first time you set instance id then share!
    console.log('ok instanceId!', val)
    if (!this.instanceMap) {
      Object.getPrototypeOf(this).instanceMap = {}
    }
    this.instance = val
    this.instanceMap[val] = this
  }
}
