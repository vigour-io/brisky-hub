'use strict'

exports.properties = {
  downstream: true,
  port: {
    type: 'observable',
    on: {
      data () {
        console.log('lullz port -- create a server!')
        console.log('on connect to server create clients -- but only after client info is send')
      }
    }
  }
}
