const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const path = require('path')

dotenv.config()

const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)

app.set('view engine', 'html')

app.get('/', (req, res) => {
  res.render('public/index.html')
})

let messages = []

io.on('connection', (socket) => {
  console.log(`Socket conectado: ${socket.id}`)

  socket.emit('previousMessage', messages)

  socket.on('sendMessage', (data) => {
    messages.push(data)

    socket.broadcast.emit('receivedMessage', data)
  })
})
const { PORT } = process.env || 4500 || 5000

server.listen(PORT)

console.log('Running on Port: ' + PORT)
