/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const { expect } = chai

const pWaitFor = require('p-wait-for')

const PeerId = require('peer-id')

const create = require('../src')
const relayIdJSON = require('./utils/peers/relay.json')
const RELAY_ADDR = `/p2p-circuit/ip4/0.0.0.0/tcp/8080/ws/p2p/${relayIdJSON.id}`

describe('Relay Server', () => {
  let node1
  let node2
  before(async () => {
    const peerId1 = await PeerId.createFromJSON(require('./utils/peers/peer1.json'))
    const peerId2 = await PeerId.createFromJSON(require('./utils/peers/peer2.json'))
    ;[node1, node2] = await Promise.all([
      create({ peerId: peerId1, delay: 100 }),
      create({ peerId: peerId2, delay: 100 })
    ])

    ;[node1, node2].forEach(node => {
      node.peerInfo.multiaddrs.clear()
      node.peerInfo.multiaddrs.add(RELAY_ADDR)
    })
  })

  it('should be able to discover over the relay', async () => {
    await Promise.all([node1, node2].map(n => n.start()))

    await pWaitFor(() => node1.peerStore.peers.size === 2)
    expect(node1.peerStore.has(node2.peerInfo.id)).to.equal(true)
  })
})
