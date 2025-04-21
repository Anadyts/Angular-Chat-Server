require('dotenv').config()
const pool = require('./pool')
const express = require('express')
const cors = require('cors')
const http = require('http')
const jwt = require('jsonwebtoken')
const { Server } = require('socket.io')
const argon2 = require('argon2')

const app = express()
const server = http.createServer(app)
const JWT_SECRET = process.env.JWT_SECRET_KEY
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:4200'
    }
})

app.use(cors())
app.use(express.json())

io.on('connection', (socket) => {
    console.log('User connected:', socket.id)
})

app.post('/api/login', async (req, res) => {
    const {username, password} = req.body
    if(username.trim() && password.trim()){
        const query = "SELECT * FROM users WHERE username = $1"
        const result = await pool.query(query, [username])

        if(result.rows.length > 0){
            const user = result.rows[0]
            if(await argon2.verify(user.password, password)){
                const token = jwt.sign({
                    user_id: user.user_id,
                    username: user.username
                }, JWT_SECRET, {expiresIn: '1h'})

                res.status(200).json({
                    message: 'Username or password is incorrect',
                    token: token
                })
            }else{
                res.status(400).json({
                    message: 'Username or password is incorrect'
                })
            }
        }else{
            res.status(400).json({
                message: 'Username or password is incorrect'
            })
        }
    }
})

app.get('/api/me', async (req, res) => {
    const {token} = req.query
    try {
        const user = jwt.verify(token, JWT_SECRET)
        res.status(200).json({
            user
        })
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            res.status(401).json({
                message: "Token expired"
            })
        }else{
            res.status(401).json({
                message: "Token Error"
            })
        }
    }
})

const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log('Server is running on port:', PORT)
})