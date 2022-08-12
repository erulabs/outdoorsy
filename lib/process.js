const db = require('./db')

const process = async file => {
  let sep = ','
  if (file.includes('|')) sep = '|'
  const lines = file.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const [first_name, last_name, email, vehicle_type, vehicle_name, vehicle_length] = line
      .split(sep)
      .map(s => s.trim())
    try {
      await db('data').insert({
        first_name,
        last_name,
        email,
        vehicle_type,
        vehicle_name,
        vehicle_length,
      })
    } catch (err) {
      console.error('Failed to insert line', { errMsg: err.message, line })
    }
  }
  console.log(`Processed ${lines.length} lines`)
  return lines.length
}

module.exports = process
