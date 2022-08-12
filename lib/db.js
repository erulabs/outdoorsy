const db = require('knex')({
  client: 'sqlite3',
  connection: { filename: './outdoorsy.sqlite' },
})

module.exports = db
