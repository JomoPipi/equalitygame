import { face } from './components/getface/getface.js';
import { emit, subscribe, subscribeOnce } from './helpers.js';
import './nomination/nomination.js';
console.log('Hello World!!!');
const state = { players: [], gamePaused: false };
const startPage = document.getElementById('nomination-page');
subscribeOnce('nomination', () => {
    startPage.style.opacity = '0';
    setTimeout(() => startPage.style.display = 'none', 1000);
});
const list = document.getElementById('playerlist');
subscribe('updatedPlayerList', (playerList) => {
    state.players = playerList;
    list.innerHTML = '';
    Object.values(playerList)
        .sort((a, b) => b.score - a.score)
        .forEach(({ name, color, score, faceData }, i) => {
        const size = 20 + Math.max(0, (10 - i) * 5);
        const container = document.createElement('div');
        container.classList.add('player-icon');
        container.innerHTML = `${name}<br>${score}`;
        const icon = document.createElement('canvas');
        icon.style.width = size + 'px';
        icon.style.height = size + 'px';
        const f = face(icon, size);
        const [mouth, eyes, hair, col] = faceData;
        for (let i = 0; i < mouth; i++)
            f.next.mouth();
        for (let i = 0; i < eyes; i++)
            f.next.eyes();
        for (let i = 0; i < hair; i++)
            f.next.hair();
        for (let i = 0; i < col; i++)
            f.next.color();
        f.render();
        container.appendChild(icon);
        list.appendChild(container);
    });
});
const itemA = document.getElementById('item-a');
const itemB = document.getElementById('item-b');
const topText = document.getElementById('the-question');
const countdown = document.getElementById('countdown');
const container = document.getElementById('items-container');
const yes = document.getElementById('yes-btn');
const no = document.getElementById('no-btn');
subscribe('winnerAndNewComparison', ({ a, b, question, lastWinner }) => {
    const winner = state.players[lastWinner];
    if (!winner)
        return setNewQ();
    topText.innerHTML = `<span class="glow">${winner.name}</span> got the answer!`;
    state.gamePaused = true;
    yes.classList.add('disabled');
    no.classList.add('disabled');
    container.style.background = `rgba(0,0,0,0.25)`;
    (function count(n) {
        if (!n) {
            countdown.innerText = '';
            container.style.background = '';
            yes.classList.remove('disabled');
            no.classList.remove('disabled');
            state.gamePaused = false;
            setNewQ();
            return;
        }
        countdown.innerText = n.toString();
        setTimeout(count.bind(null, n - 1), 600);
    })(3);
    function setNewQ() {
        itemA.innerText = a.text;
        itemB.innerText = b.text;
        itemA.style.color = a.color;
        itemB.style.color = b.color;
        topText.innerHTML = '';
        topText.innerText = question;
    }
});
document.getElementById('yes-no-btns').onclick = e => {
    if (state.gamePaused)
        return;
    const target = e.target;
    if (![yes, no].includes(target))
        return;
    const answer = target === yes;
    emit('answer', answer);
};
//# sourceMappingURL=main.js.map