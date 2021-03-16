import { emit } from "../helpers.js";
const button = document.getElementById('nomination-button');
const input = document.getElementById('nomination-input');
button.onclick = submit;
function submit() {
    const s = input.value;
    if (!s)
        return alert('Please enter a name.');
    emit('nomination', s);
}
//# sourceMappingURL=nomination.js.map