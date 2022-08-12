const process = require('../../lib/process')

export default async function handler(req, res) {
  const fileUpload = req.body
  const parts = fileUpload.replace(/\r\n/g, '\n').trim().split('\n')
  const _boundary = parts.shift()
  const _disposition = parts.shift()
  const contentType = parts.shift()
  if (contentType !== 'Content-Type: text/plain') {
    return res.status(400).send({ error: 'Sorry, only plain text files allowed for now' })
  }
  parts.shift()
  const _boundaryEnd = parts.pop()

  await process(parts.join('\n'))

  return res.status(200).send({ success: 'woot!' })
}
