#!/usr/bin/env node

const fs = require('fs')
const { program } = require('commander')
const Table = require('cli-table')
const db = require('./lib/db')
const process = require('./lib/process')

program
  .command('add <file>')
  .description('Adds a new file to the data list')
  .action(async file => {
    if (fs.statSync(file)) {
      const data = fs.readFileSync(file).toString().trim()
      await process(data)
    } else {
      console.error(`${file} does not exist`)
    }
    db.destroy()
  })

program
  .command('list')
  .option('-s, --sort <column>', 'Sort by a column', 'first_name')
  .description('List data in the database')
  .action(options => {
    db.select('first_name', 'last_name', 'email', 'vehicle_type', 'vehicle_name', 'vehicle_length')
      .from('data')
      .orderBy(options.sort, 'desc')
      .then(rows => {
        const data = rows.map(u => {
          return [
            u.first_name,
            u.last_name,
            u.email,
            u.vehicle_type,
            u.vehicle_name,
            u.vehicle_length,
          ].map(s => s.trim())
        })
        db.destroy()
        const table = new Table({
          head: [
            'First Name',
            'Last Name',
            'Email',
            'Vehicle Type',
            'Vehicle Name',
            'Vehicle Length',
          ],
        })
        table.push(...data)
        console.log(table.toString())
      })
  })

program.parse()
