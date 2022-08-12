const knex = require('./db')

const process = async file => {
  let sep = ','
  if (file.includes('|')) sep = '|'
  file.split('\n').forEach(async line => {
    const [first_name, last_name, email, vehicle_type, vehicle_name, vehicle_length] =
      line.split(sep)
    await knex('data').insert({
      first_name,
      last_name,
      email,
      vehicle_type,
      vehicle_name,
      vehicle_length,
    })
  })
}

module.exports = process
