






import { SocketEvents } from "../../shared/constants.js"

const button = document.getElementById('nomination-button') as HTMLButtonElement
const input = document.getElementById('nomination-input') as HTMLInputElement

export function nominate(socket : MySocket) {
  
  button.onclick = submit

  function submit() {
    const s = input.value
    if (!s) return alert('Please enter a name.')
    
    socket.emit(SocketEvents.nomination, s)
  }
}