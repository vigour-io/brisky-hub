'use strict'
//
// describe('set', function () {
//   var server, reciever
//   var Hub = require('../../lib')
//   var Mock = require('../../lib/protocol/mock')
//
//   it('can create multiple hubs', function () {
//     server = new Hub({
//       key: 'server'
//     })
//     reciever = new Hub({
//       key: 'receiver'
//     })
//   })
//
//   it('can set the adapater using a mock protocol on a', function () {
//     server.set({
//       adapter: {
//         id: 'server',
//         mock: new Mock()
//       }
//     })
//     expect(server.adapter.mock).to.be.instanceof(Mock)
//     expect(server.adapter.id).to.equal('server')
//   })
//
//   it('can set the adapater using a mock protocol on b', function () {
//     receiver.set({
//       adapter: {
//         id: 'receiver',
//         mock: new Mock()
//       }
//     })
//     expect(receiver.adapter.mock).to.be.instanceof(Mock)
//     expect(receiver.adapter.id).to.equal('reciever')
//   })
//
//   it('can create a server "server"', function () {
//     server.adapter.set({
//       mock: {
//         server: 'server'
//       }
//     })
//   })
//
//   it('receiver can connect to server', function (done) {
//     receiver.adapter.set({ mock: 'server' })
//     // maybe make this a bit easier to access e.g. protocol will get a connected observable
//     receiver.adapter.mock.client.origin.connection.origin.on('connect', done)
//   })
//
// })
