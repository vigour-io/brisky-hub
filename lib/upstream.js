'use strict'

exports.properties = {
  upstream: true,
  url: {
    type: 'observable',
    on: {
      data () {
        console.log('lullz url -- connect -- create client and maybe switch url a few times')
      }
    }
  }
}

exports.connected = {
  val: false,
  sync: false
}
