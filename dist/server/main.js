"use strict";
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const newId = require('./new_id.js');
const clientPath = path.join(__dirname);
app.use(express.static(path.join(__dirname, '/../../')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/../../index.html')));
http.listen(8080, () => { console.log('listening on port 8080'); });
const PlayerList = {};
const colors = ['red', 'blue', 'green', 'purple', 'orange', 'cyan', 'gray'];
const getNums = () => {
    const n1 = Math.random() * 1e9 | 0;
    const n2 = chance(.5) ? n1 : Math.random() * 1e9 | 0;
    return [n1, n2];
};
const getColors = () => {
    const color1 = Math.random() * colors.length | 0;
    const color2 = chance(.5) ? color1 : Math.random() * colors.length | 0;
    return [colors[color1], colors[color2]];
};
const genAB = () => {
    const [n1, n2] = getNums();
    const [color1, color2] = getColors();
    const a = { text: n1.toString(), color: color1 };
    const b = { text: n2.toString(), color: color2 };
    return [a, b];
};
const chance = (percent) => Math.random() < percent;
const QUESTIONS = [{ text: 'Are the numbers equal?',
        equals(a, b) { return a.text === b.text; },
        generateAB: genAB
    },
    { text: 'Are the colors equal?',
        equals(a, b) { return a.color === b.color; },
        generateAB: genAB
    },
    { text: 'Are the lengths equal?',
        equals(a, b) { return a.text.length === b.text.length; },
        generateAB() {
            const rnd6Digit = () => (0.89 * Math.random() + 0.1) * 1e7 + Math.random() * 1e5 | 0;
            const a = rnd6Digit();
            const b = chance(.5) ? rnd6Digit() : Math.random() * 1e5 | 0;
            const [c1, c2] = getColors();
            return [{ text: a.toString(), color: c1 }, { text: b.toString(), color: c2 }];
        }
    },
    { text: 'Are these exactly equal?',
        equals(a, b) { return a.text === b.text && a.color === b.color; },
        generateAB: genAB
    }, { text: 'Are the sums of digits equal?',
        equals(a, b) { return [...a.text].reduce((acc, v) => acc + +v, 0) === [...b.text].reduce((acc, v) => acc + +v, 0); }, generateAB() {
            const sumA = Math.random() * 8 + 2 | 0;
            const sumB = chance(.5) ? sumA : sumA + Math.sign(Math.random() - .5);
            const numsA = [];
            const numsB = [];
            for (const [sum, nums] of [[sumA, numsA], [sumB, numsB]]) {
                for (let i = 0; i < sum;) {
                    const digit = Math.min(sum - i, Math.random() * 9 | 0);
                    i += digit;
                    nums.push(digit);
                }
            }
            const [c1, c2] = getColors();
            return [{ text: numsA.join(''), color: c1 }, { text: numsB.join(''), color: c2 }];
        }
    }, { text: 'Are they permutations of each other?',
        equals(a, b) { return [...a.text].sort().join('') === [...b.text].sort().join(''); },
        generateAB() {
            if (chance(.5))
                return genAB();
            const characters = [...Array(Math.random() * 5 + 5 | 0)].map(_ => Math.random() * 9 | 0);
            const numsA = characters;
            const numsB = characters.slice();
            shuffleArray(numsB);
            const [c1, c2] = getColors();
            return [{ text: numsA.join(''), color: c1 }, { text: numsB.join(''), color: c2 }];
        }
    }];
const currentPair = { a: { color: 'red', text: '123' },
    b: { color: 'blue', text: '321' },
    question: QUESTIONS[0].text,
    index: 0,
    lastWinner: -1
};
function updatePair() {
    const index = Math.random() * QUESTIONS.length | 0;
    const [a, b] = QUESTIONS[index].generateAB();
    currentPair.a = a;
    currentPair.b = b;
    currentPair.question = QUESTIONS[index].text;
    currentPair.index = index;
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
io.on('connection', (socket) => {
    console.log('a user connected');
    const id = newId();
    socket.on('nomination', (name) => {
        console.log('new player named: ' + name + "!");
        PlayerList[id] =
            { color: colors[id % colors.length],
                id,
                score: 0,
                name, faceData: [...Array(4)].map(_ => Math.random() * 9)
            };
        socket.emit('nomination', '');
        io.emit('updatedPlayerList', PlayerList);
    });
    socket.on('disconnect', () => {
        const removed = PlayerList[id];
        if (!removed)
            return;
        delete PlayerList[id];
        console.log(`user ${removed.name} disconnected`);
        io.emit('updatedPlayerList', PlayerList);
    });
    socket.on('answer', (answeredYes) => {
        const correct = answeredYes === QUESTIONS[currentPair.index].equals(currentPair.a, currentPair.b);
        if (!PlayerList[id])
            return;
        if (correct) {
            PlayerList[id].score += 200;
            updatePair();
            currentPair.lastWinner = id;
            io.emit('winnerAndNewComparison', currentPair);
        }
        else {
            PlayerList[id].score = PlayerList[id].score * .6 | 0;
        }
        io.emit('updatedPlayerList', PlayerList);
    });
    io.emit('winnerAndNewComparison', currentPair);
});
//# sourceMappingURL=main.js.map