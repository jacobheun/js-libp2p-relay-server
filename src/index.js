'use strict'

const PeerInfo = require('peer-info')
const Libp2p = require('libp2p')
const Websockets = require('libp2p-websockets')
const Secio = require('libp2p-secio')
const Mplex = require('libp2p-mplex')
const GossipSub = require('libp2p-gossipsub')
const PubsubPeerDiscovery = require('libp2p-pubsub-peer-discovery')

/**
 *
 * @param {object} [options]
 * @param {PeerId} [options.peerId]
 */
async function create (options = {}) {
  const peerInfo = await PeerInfo.create(options.peerId)

  // TODO: Reusable peer id
  const libp2p = await Libp2p.create({
    peerInfo,
    modules: {
      transport: [Websockets],
      streamMuxer: [Mplex],
      connEncryption: [Secio],
      pubsub: GossipSub,
      peerDiscovery: [PubsubPeerDiscovery]
    },
    config: {
      relay: {
        enabled: true,
        hop: {
          enabled: true,
          active: false
        }
      },
      pubsub: {
        enabled: true,
        emitSelf: false,
        signMessages: true,
        strictSigning: true
      },
      peerDiscovery: {
        [PubsubPeerDiscovery.tag]: {
          delay: options.delay || 5000,
          enabled: true
        }
      }
    },
    // TODO: Make these limits configurable
    connectionManager: {
      maxConnections: 500,
      minConnections: 0,
      pollInterval: 2000,
      defaultPeerValue: 1
    }
  })

  // TODO: Configurable addresses
  libp2p.peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/8080/ws')

  return libp2p
}

module.exports = create
