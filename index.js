require('dotenv').config()
const pool = require('./pool')
const express = require('express')
const cors = require('cors')
const http = require('http')
const jwt = require('jsonwebtoken')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:4200'
    }
})

io.on('connection', (socket) => {
    console.log('User connected:', socket.id)
})

const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log('Server is running on port:', PORT)
})