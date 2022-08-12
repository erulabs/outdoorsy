// @flow

const fs = require('fs')
const { expect } = require('chai')

const describe = global.describe
const it = global.it

const db = require('../lib/db')
const process = require('../lib/process')

describe('process', function () {
  it('adds records to the database', async function () {
    await db('data').del()
    const test1 = fs.readFileSync('./test/test1.txt').toString().trim()
    const numRecords = test1.split('\n').length
    const numProcessed = await process(test1)
    expect(numRecords, 'numRecords').to.equal(numProcessed, 'numProcessed')
    const rows = await db
      .select('first_name', 'last_name', 'email', 'vehicle_type', 'vehicle_name', 'vehicle_length')
      .from('data')
    expect(rows.length, 'rows.length').to.equal(numRecords, 'numRecords')
  })
})

global.after(function () {
  setTimeout(() => {
    db.destroy()
  }, 100)
})
