require('dotenv').config()
const {Pool} = require('pg')

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

pool.query("SELECT NOW()").then((res) => {
    console.log('PostgreSQL is running', res.rows)
})
.catch(err => {
    console.log('Server PostgreSQL is Failed', err)
}) 
module.exports = pool 