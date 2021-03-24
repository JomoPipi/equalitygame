export const SocketEvents = {
    nomination: "nomination",
    updatedPlayerList: "updatedPlayerList",
    winnerAndNewComparison: "winnerAndNewComparison",
    answer: "answer"
};
export const Colors = ['red', 'blue', 'green', 'purple', 'orange', 'gray'];
export const QUESTIONS = (() => {
    return [{ text: 'Are the numbers equal?',
            equals(a, b) { return a.text === b.text; },
            generateAB: genAB
        },
        { text: 'Are the colors equal?',
            equals(a, b) { return a.color === b.color; },
            generateAB: genAB
        },
        { text: 'Same number of digits?',
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
                const characters = [...Array(Math.random() * 5 + 3 | 0)].map(_ => Math.random() * 9 | 0);
                const numsA = characters;
                const numsB = characters.slice();
                shuffleArray(numsB);
                const [c1, c2] = getColors();
                return [{ text: numsA.join(''), color: c1 }, { text: numsB.join(''), color: c2 }];
            }
        }];
    function getNums() {
        const n1 = Math.random() * 1e9 | 0;
        const n2 = chance(.5) ? n1 : Math.random() * 1e9 | 0;
        return [n1, n2];
    }
    function getColors() {
        const color1 = Math.random() * Colors.length | 0;
        const color2 = chance(.5) ? color1 : Math.random() * Colors.length | 0;
        return [Colors[color1], Colors[color2]];
    }
    function genAB() {
        const [n1, n2] = getNums();
        const [color1, color2] = getColors();
        const a = { text: n1.toString(), color: color1 };
        const b = { text: n2.toString(), color: color2 };
        return [a, b];
    }
    function chance(percent) { return Math.random() < percent; }
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
})();
//# sourceMappingURL=constants.js.map