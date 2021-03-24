






import { Colors, QUESTIONS, SocketEvents } from '../shared/constants.js'
import express from "express";
import { createServer } from "http";
import path from "path"
import { Server, Socket } from 'socket.io';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const http = createServer(app);
const io = new Server(http, {
  // options
});
import { newId } from './new_id.js'

app.use(express.static(path.join(__dirname, '/../../')))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/../../index.html')) )

http.listen(8080, () => {console.log('listening on port 8080') })

const PlayerList : Record<string,Player> = {}

const currentPair : GameRound = 
  { a: { color: 'red', text: '123' }
  , b: { color: 'blue', text: '321' }
  , questionIndex: 0
  , lastWinnerId: ''
  }

function updatePair() {
  const index = Math.random() * QUESTIONS.length | 0
  const [a, b] = QUESTIONS[index].generateAB()
  currentPair.a = a
  currentPair.b = b
  currentPair.questionIndex = index
}

io.on('connection', (_s : Socket) => {
  console.log('a user connected')
  
  const socket = _s as any as MySocket
  const id = newId().toString()
  socket.on(SocketEvents.nomination, name => {
    console.log('new player named: ' + name + "!")
    PlayerList[id] = 
      { color: Colors[+id % Colors.length]
      , id
      , score: 0
      , name
      , faceData: [Math.random()*9, Math.random()*9, Math.random()*9, Math.random()*9]
      }
      
    socket.emit(SocketEvents.nomination, id)
    io.emit(SocketEvents.updatedPlayerList, PlayerList)
  })
  
  socket.on('disconnect' as any, () => {
    const removed = PlayerList[id]
    if (!removed) return;
    delete PlayerList[id]
    console.log(`user ${removed.name} disconnected`);
    io.emit(SocketEvents.updatedPlayerList, PlayerList)
  })

  socket.on(SocketEvents.answer, answeredYes => {
    const correct = answeredYes === QUESTIONS[currentPair.questionIndex].equals(currentPair.a, currentPair.b)
    if (!PlayerList[id]) return;
    if (correct)
    {
      PlayerList[id].score += 200
      updatePair()
      currentPair.lastWinnerId = id
      io.emit(SocketEvents.winnerAndNewComparison, currentPair)
    }
    else
    {
      PlayerList[id].score = PlayerList[id].score * .6 | 0
    }
    io.emit(SocketEvents.updatedPlayerList, PlayerList)
  })

  io.emit(SocketEvents.winnerAndNewComparison, currentPair)
})