#!/usr/bin/env node

const repl = require('repl')
const logger = require('../lib/logger')

const Models = {}

async function Repl() {
  const myRepl = repl.start('> ')

  logger.silly('Adding models: ')
  const objectsToAdd = Object.assign({}, Models, {
    // connectQueues,
    // sendToQueue,
  })
  for (const model in objectsToAdd) {
    logger.silly(model + ', ')
    Object.defineProperty(myRepl.context, model, {
      configurable: false,
      enumerable: true,
      value: objectsToAdd[model],
    })
  }
}

process.on('SIGINT', () => {
  process.exit(1)
})

process.on('uncaughtException', (err, origin) => {
  console.error(err)
})

Repl()
