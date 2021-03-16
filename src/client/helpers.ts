






const socket = io();

type Callback = (msg : any) => void

export function subscribe(type : SocketTypes, callback : Callback) {
  console.log('subscribed!')
  socket.on(type, callback)
}

export function subscribeOnce(type : SocketTypes, callback : Callback) {
  console.log('subscribed once!')
  socket.once(type, callback)
}

export function emit(type : SocketTypes, data : any) {
  socket.emit(type, data)
}