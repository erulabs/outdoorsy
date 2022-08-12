const knex = require('../../lib/db')
export default async function handler(req, res) {
  await knex('data').del()
  res.status(200).json({ success: 'deleted!' })
}
