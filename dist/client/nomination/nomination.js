import { SocketEvents } from "../../shared/constants.js";
const button = document.getElementById('nomination-button');
const input = document.getElementById('nomination-input');
export function nominate(socket) {
    button.onclick = submit;
    function submit() {
        const s = input.value;
        if (!s)
            return alert('Please enter a name.');
        socket.emit(SocketEvents.nomination, s);
    }
}
//# sourceMappingURL=nomination.js.map