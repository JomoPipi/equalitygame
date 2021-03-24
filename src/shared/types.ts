






interface Player {
  color : string
  id : number
  score : number
  name : string
  faceData : [number, number, number, number]
}

type SocketEvents
    = 'nomination'
    | 'updatedPlayerList'
    | 'winnerAndNewComparison'
    | 'answer'

interface MySocket {
  on(event : SocketEvents, fn : (x : any) => void) : SocketIOClient.Emitter
  once(event : SocketEvents, fn : (x : any) => void) : SocketIOClient.Emitter
  emit(event : SocketEvents, data : any) : SocketIOClient.Emitter
}