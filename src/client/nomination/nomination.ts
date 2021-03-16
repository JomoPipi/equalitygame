






import { emit } from "../helpers.js"

const button = document.getElementById('nomination-button') as HTMLButtonElement
const input = document.getElementById('nomination-input') as HTMLInputElement

button.onclick = submit

function submit() {
  const s = input.value
  if (!s) return alert('Please enter a name.')
  
  emit('nomination', s)
}

export {}