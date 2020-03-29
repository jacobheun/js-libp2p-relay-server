'use strict'

const PeerID = require('peer-id')

const create = require('./src')
const peerIdJSON = require('./test/utils/peers/relay.json')
let libp2p

const before = async () => {
  const peerId = await PeerID.createFromJSON(peerIdJSON)
  libp2p = await create({ peerId })
  await libp2p.start()
}

const after = async () => {
  await libp2p.stop()
}

module.exports = {
  hooks: {
    pre: before,
    post: after
  }
}