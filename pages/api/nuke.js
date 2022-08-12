const db = require('../../lib/db')
export default async function handler(req, res) {
  await db('data').del()
  res.status(200).json({ success: 'deleted!' })
}
