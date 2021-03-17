






const express = require('express')
const app = express();
const http = require('http').Server(app);
const path = require('path')
const io = require('socket.io')(http);
const clientPath = path.join(__dirname);

app.use(express.static(path.join(__dirname, '/../../')))

app.get('/', (req : Request, res : any) => {
  res.sendFile(path.join(__dirname, '/../../index.html'));
});

const PlayerList : Record<number,Player> = {}

let nextId = 0
const colors = ['red','blue','green','purple','orange','cyan','gray'] as const
type GameItem = { color : string, text : string }
type Question = { text : string, equals(a : GameItem, b : GameItem) : boolean, generateAB() : [GameItem, GameItem] }

const getNums = () => {
  const n1 = Math.random() * 1e9 | 0
  const n2 = chance(.5) ? n1 : Math.random() * 1e9 | 0
  return [n1, n2]
}
const getColors = () => {
  const color1 = Math.random() * colors.length | 0
  const color2 = chance(.5) ? color1 : Math.random() * colors.length | 0
  return [colors[color1], colors[color2]]
}

const genAB = () => {
  const [n1, n2] = getNums()
  const [color1, color2] = getColors()
  const a = { text: n1.toString(), color: color1 }
  const b = { text: n2.toString(), color: color2 }
  return [a, b] as [GameItem, GameItem]
}
const chance = (percent : number) => Math.random() < percent

const QUESTIONS : Question[] =
  [ { text: 'Are the numbers equal?'
    , equals(a, b) { return a.text === b.text }
    , generateAB: genAB
    }
  , { text: 'Are they the same color'
    , equals(a, b) { return a.color === b.color }
    , generateAB : genAB
    }
  , { text: 'Are the lengths the same?'
    , equals(a, b) { return a.text.length === b.text.length }
    , generateAB() {
        const rnd6Digit = () => (0.89 * Math.random() + 0.1) * 1e7 + Math.random() * 1e5 | 0
        const a = rnd6Digit()
        const b = chance(.5) ? rnd6Digit() : Math.random() * 1e5 | 0
        const [c1, c2] = getColors()
        return [{ text: a.toString(), color: c1 }, { text: b.toString(), color: c2 }]
      }
    }
  , { text: 'Are these exactly the same?'
    , equals(a, b) { return a.text === b.text && a.color === b.color }
    , generateAB: genAB
    }
  , { text: 'Are the sums of digits equal?'
    , equals(a, b) { return [...a.text].reduce((acc, v) => acc + +v, 0) === [...b.text].reduce((acc, v) => acc + +v, 0) }
    , generateAB() {
        const sumA = Math.random() * 8 + 2 | 0
        const sumB = chance(.5) ? sumA : sumA + 1
        const numsA = []
        const numsB = []
        for (let i = 0; i < sumA;)
        {
          const digit = Math.min(sumA - i, Math.random() * 9 | 0)
          i += digit
          numsA.push(digit)
        }
        for (let i = 0; i < sumB;)
        {
          const digit = Math.min(sumB - i, Math.random() * 9 | 0)
          i += digit
          numsB.push(digit)
        }
        const [c1, c2] = getColors()
        return [{ text: numsA.join(''), color: c1 }, { text: numsB.join(''), color: c2 }]
      }
    }
  , { text: 'Are they permutations of each other?'
    , equals(a, b) { return [...a.text].sort().join('') === [...b.text].sort().join('') }
    , generateAB() {
        if (chance(.5)) return genAB() 
        const characters = [...Array(Math.random() * 5 + 5 | 0)].map(_ => Math.random() * 9 | 0)
        const numsA = characters
        const numsB = characters.slice()
        shuffleArray(numsB)
        const [c1, c2] = getColors()
        return [{ text: numsA.join(''), color: c1 }, { text: numsB.join(''), color: c2 }]
      }
    }
  ]

const currentPair : Record<'a' | 'b', GameItem> & { question : string, index : number, lastWinner : number } = 
  { a: { color: 'red', text: '123' }
  , b: { color: 'blue', text: '321' }
  , question: QUESTIONS[0].text
  , index: 0
  , lastWinner: -1
  }

const SocketTypes : { [key in SocketTypes] : key } = 
  { nomination: 'nomination'
  , winnerAndNewComparison: 'winnerAndNewComparison'
  , answer: 'answer'
  , updatedPlayerList: 'updatedPlayerList'
  }

interface Socket {
  emit(type : SocketTypes, data : any) : void
  on(type : SocketTypes | 'disconnect', callback : Function) : void
}

io.on('connection', (socket : Socket) => {
  console.log('a user connected');

  const id = nextId++
  socket.on('nomination', (name : string) => {
    console.log('new player named: ' + name + "!")
    PlayerList[id] = 
      { color: colors[id % colors.length]
      , id
      , score: 0
      , name
      , faceData: [...Array(4)].map(_ => Math.random() * 9) as 
        [number,number,number,number]
      }
      
    socket.emit('nomination', '')
    io.emit('updatedPlayerList', PlayerList)
  })

  socket.on('disconnect', () => {
    const removed = PlayerList[id]
    if (!removed) return;
    delete PlayerList[id]
    console.log(`user ${removed.name} disconnected`);
    io.emit('updatedPlayerList', PlayerList)
  });

  socket.on('answer', (answeredYes : boolean) => {
    const correct = answeredYes === QUESTIONS[currentPair.index].equals(currentPair.a, currentPair.b)
    if (!PlayerList[id]) return;
    if (correct)
    {
      PlayerList[id].score += 150
    }
    else
    {
      PlayerList[id].score = PlayerList[id].score * .6 | 0
    }
    
    if (correct)
    {
      updatePair()
      currentPair.lastWinner = id
      io.emit('winnerAndNewComparison', currentPair)
    }
    io.emit('updatedPlayerList', PlayerList)
  })

  io.emit('winnerAndNewComparison', currentPair)
});

function updatePair() {
  const index = Math.random() * QUESTIONS.length | 0
  const [a, b] = QUESTIONS[index].generateAB()
  currentPair.a = a
  currentPair.b = b
  currentPair.question = QUESTIONS[index].text
  currentPair.index = index
}

http.listen(8080, () => {
  console.log('listening on *:8080');
});

function shuffleArray(array : any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
}