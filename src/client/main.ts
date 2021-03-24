






import { face } from './components/getface/getface.js'
import { nominate } from './nomination/nomination.js'
import { flash } from './flash.js'
import { SocketEvents } from '../shared/constants.js'

const socket : MySocket = io();

nominate(socket)

type GameState = { players : Record<number,Player>, gamePaused : boolean, playerId : number }

const state : GameState = 
  { players: []
  , gamePaused: false
  , playerId: -1
  }

const startPage = document.getElementById('nomination-page')!
socket.once(SocketEvents.nomination, id => {
  state.playerId = id
  startPage.style.opacity = '0'
  setTimeout(() => startPage.style.display = 'none', 1000)
})

const mainPage = document.getElementById('main-page')!
const list = document.getElementById('playerlist')!
socket.on(SocketEvents.updatedPlayerList, (playerList : Record<number,Player> ) => {
  list.innerHTML = ''
  Object.values(playerList)
    .sort((a,b) => b.score - a.score)
    .forEach(({ name, color, score, faceData, id }, i) => {
      const size = 20 + Math.max(0, (10 - i) * 5)
      const container = document.createElement('div')
        container.style.border = `2px solid ${color}`
        container.classList.add('player-icon')
        container.innerHTML = `${name}<br>${score}`
      const icon = document.createElement('canvas')
        icon.style.width = size + 'px'
        icon.style.height = size + 'px'
        const f = face(icon, size)
        const [mouth, eyes, hair, col] = faceData
        for (let i = 0; i < mouth; i++) f.next.mouth()
        for (let i = 0; i < eyes; i++) f.next.eyes()
        for (let i = 0; i < hair; i++) f.next.hair()
        for (let i = 0; i < col; i++) f.next.color()
        f.render()
        container.appendChild(icon)
        list.appendChild(container)

      const difference = score - (state.players[id]?.score ?? score)
      const flashColor = difference > 0 ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'
      if (difference !== 0)
      {
        flash(flashColor, container)
        if (id === state.playerId)
        {
          flash(flashColor, mainPage)
        }
      }
    })
  state.players = playerList
})

const itemA = document.getElementById('item-a')!
const itemB = document.getElementById('item-b')!
const topText = document.getElementById('the-question')!
const countdown = document.getElementById('countdown')!
const container = document.getElementById('items-container')!
const yes = document.getElementById('yes-btn')!
const no = document.getElementById('no-btn')!
socket.on(SocketEvents.winnerAndNewComparison, ({ a, b, question, lastWinner }) => {

  const winner = state.players[lastWinner]

  if (!winner) return setNewQ()

  topText.innerHTML = `<span class="glow">${winner.name}</span> got the answer!`
  
  state.gamePaused = true
  yes.classList.add('disabled')
  no.classList.add('disabled')
  ;(function count(n) {
    if (!n)
    {
      countdown.innerText = '🤔'
      yes.classList.remove('disabled')
      no.classList.remove('disabled')
      state.gamePaused = false
      setNewQ()
      return;
    }
    countdown.innerText = n.toString()
    setTimeout(count.bind(null, n-1), 600)
  })(3)

  function setNewQ() {
    itemA.innerText = a.text
    itemB.innerText = b.text
    itemA.style.color = a.color
    itemB.style.color = b.color
    topText.innerHTML = ''
    topText.innerText = question
  }
})

document.getElementById('yes-no-btns')!.onclick = e => {
  if (state.gamePaused) return;
  const target = e.target
  if (![yes,no].includes(target as any)) return;
  const answer = target === yes
  socket.emit(SocketEvents.answer, answer)
}

export {}