import express, { Application } from 'express';
import path from 'path'
import { createServer } from 'http';
import { config } from 'dotenv';
import createSocketServer from 'socket.io'
import './core/db'
import createRoutes from './core/routes'
import cors from 'cors';
import { verifyJWToken } from './utils'
import uuidv1 from 'uuid/v1'
import { User } from './models'

const app: Application = express()
const http = createServer(app)
const io = createSocketServer(http)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

config()

if(process.env.NODE_ENV === 'development') {
  app.use(express.static(__dirname))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'))
  })
}

createRoutes(app, io)

app.get('/', (req, res) => {
  res.send('Hello')
})

//socket server
let game: any[] = [];
io.on('connection', socket => {
  console.log(`New server connect HAND:`,socket.handshake)
  socket.emit('CLIENT_HANDSHAKE', {socket: socket.id})
  // socket.handshake
  // jwt check => user._id => updateGame =>
  // socket.on('HANDSHAKE', ({token}) => verifyJWToken(token).then(data => console.log(data)))
  socket.on('GAME:FINDING', ({token}) => {
    if(!token) {
      //rip connect
    }
    let userData: any;
    verifyJWToken(token)
      .then(data => {
        console.log('THEN_BRANCH', data)
        userData = data
        console.log('USERDATA', userData)
        if(game.length === 0) {
          game.push({socket: socket.id, userId: userData._id})
          socket.emit('GAME:START_FINDING')
          console.log('GAME_PUSH_BRANCH', userData)
        } else { // User.update() join to Random() room
          const commonAd = uuidv1()
          User.updateMany({_id: game[0].userId || userData.userId}, {gameId: commonAd})
            .then(() => {})
            .catch((er) => {console.log('USER_UPDATE_ERROR: ',er)})
          socket.to(game[0].socket).emit('GAME:FIND', {partner: socket.id, address: commonAd})
          socket.emit('GAME:FIND', {partner: game[0].socket, address: commonAd})
          game = []
          console.log('GAME_FIND_BRANCH', userData)
        }
      })
      .catch(er => console.log('ERROR', er))
    
  })
  socket.on('JOIN_TO_GAME', (address, fn) => {socket.join(address, () => fn('success'))})
  socket.on('GAME:STOP_FINDING', () => {
    game.pop()
  })
  socket.on('GAME:MOVE', ({address, payload}) => socket.to(address).emit('GAME:MOVE', {payload}))
})


http.listen(process.env.PORT, () => {
  console.log(`Example app listening on ${process.env.PORT}`)
})