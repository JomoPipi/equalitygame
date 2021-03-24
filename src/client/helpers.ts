






import { SocketEvents } from '../shared/constants.js'

interface MySocket {
  on(event : SocketEvents, fn : Function) : SocketIOClient.Emitter
  once(event : SocketEvents, fn : Function) : SocketIOClient.Emitter
  emit(event : SocketEvents, data : any) : SocketIOClient.Emitter
}

const socket : MySocket = io();


// export function subscribe(type : SocketEvents, callback : Callback) {
//   console.log(' subscribed!')
//   socket.on(type, callback)
// }

// export function subscribeOnce(type : SocketEvents, callback : Callback) {
//   console.log('subscribed once!')
//   socket.once(type, callback)
// }

// export function emit(type : SocketEvents, data : any) {
//   socket.emit(type, data)
// }