'use strict'

// const test = require('tape')
const Hub = require('../../')

const clockLabel = process.argv[2] || 'behind'
const twoDays = 2 * 24 * 60 * 60 * 1000
const offsets = {
  'behind': -twoDays,
  'ahead': twoDays
}

const n = Number(process.argv[3])
const id = `client${n + 1}`

const _realNow = Date.now
const _realGetTime = Date.prototype.getTime

Date.now = function badNow () {
  const realStamp = _realNow.call(Date)
  return realStamp + offsets[clockLabel]
}

Date.prototype.getTime = function badGetTime () { // eslint-disable-line
  const realStamp = _realGetTime.call(this)
  return realStamp + offsets[clockLabel]
}

const hub = new Hub({
  id,
  label: {
    sync: false,
    val: id
  },
  context: false,
  url: 'ws://no-connect'
})
hub.subscribe({ testProperty: { val: true }, testObj: { val: true } })

process.on('message', msg => {
  // console.log('SPAWNED GOT MESSAGE', msg.label, msg.data)
  const label = msg.label
  const data = msg.data
  if (label === 'set') {
    hub.set(data)
    report()
  } else if (label === 'report') {
    report()
  } else if (label === 'destroy') {
    process.exit()
  }
})

process.send('ready')

function report () {
  process.send({
    label: 'report',
    data: hub.serialize()
  })
}

// hub.connected.on('data', (val) => {
//   console.log('========= spawned hub connected', val)
// })
