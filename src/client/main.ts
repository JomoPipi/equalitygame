






import { face } from './components/getface/getface.js'
import { emit, subscribe, subscribeOnce } from './helpers.js'
import './nomination/nomination.js'

console.log('Hello World!!!')

const startPage = document.getElementById('nomination-page')!
subscribeOnce('nomination', () => {
  startPage.style.opacity = '0'
  setTimeout(() => startPage.style.display = 'none', 1000)
})

const list = document.getElementById('playerlist')!
subscribe('updatedPlayerList', (playerList : any[]) => {
  list.innerHTML = ''
  Object.values(playerList)
    .sort((a,b) => b.score - a.score)
    .forEach(({ name, color, score, faceData }, i) => {
      const size = 20 + Math.max(0, (10 - i) * 5)
      const container = document.createElement('div')
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
    })

  // list.innerHTML = 
  //   Object.values(playerList)
  //     .sort((a,b) => b.score - a.score)
  //     .map(({ name, color, score }, i) => {
  //       const size = 20 + Math.max(0, (10 - i) * 5)
  //       return `<div 
  //         class="player-icon" 
  //         style="background:${color};width:${size}px;height:${size}px;">
  //         ${name}<br>${score}
  //       </div>`
  //     }).join('')
})

const itemA = document.getElementById('item-a')!
const itemB = document.getElementById('item-b')!
subscribe('newComparison', ({ a, b, question }) => {
  itemA.innerText = a.text
  itemB.innerText = b.text
  itemA.style.color = a.color
  itemB.style.color = b.color
  document.getElementById('the-question')!.innerText = question
})

const yes = document.getElementById('yes-btn')
const no = document.getElementById('no-btn')
document.getElementById('yes-no-btns')!.onclick = e => {
  const target = e.target
  if (![yes,no].includes(target as any)) return;
  const answer = target === yes
  emit('answer', answer)
}

export {}