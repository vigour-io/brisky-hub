'use strict'

exports.properties = {
  upstream: true,
  url: {
    type: 'observable',
    on: {
      data () {
        console.log('lullz url -- connect -- create client and maybe switch')
      }
    }
  }
}

exports.connected = {
  val: false,
  sync: false
}
