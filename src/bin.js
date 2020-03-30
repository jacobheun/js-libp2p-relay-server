#!/usr/bin/env node
'use strict'
/* eslint-disable no-console */

const fs = require('fs')

const PeerId = require('peer-id')

const create = require('./index')
const argv = require('minimist')(process.argv.slice(2))

;(async () => {
  const idPath = argv.peerId
  let peerId
  try {
    peerId = await PeerId.createFromJSON(JSON.parse(fs.readFileSync(idPath)))
    console.log(peerId.toB58String())
  } catch (err) {
    console.error('could not read peer id from path %s', idPath)
  }

  const libp2p = await create({ peerId })
  await libp2p.start()

  console.log('Started relay with id:', libp2p.peerInfo.id.toB58String())

  libp2p.transportManager.getAddrs().forEach(addr => {
    console.log('Listening on:', String(addr))
  })

  process.on('SIGINT', async () => {
    await libp2p.stop()
    console.log('relay server stopped')
    process.exit()
  })
})()
