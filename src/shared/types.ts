






interface Player {
  color : string
  id : string
  score : number
  name : string
  faceData : [number, number, number, number]
}

type GameItem = { color : string, text : string }
type Question = { text : string, equals(a : GameItem, b : GameItem) : boolean, generateAB() : [GameItem, GameItem] }
type GameRound = { a : GameItem, b : GameItem, questionIndex : number, lastWinnerId : string }

type SocketEvents = "nomination" | "updatedPlayerList" | "winnerAndNewComparison" | "answer"

type SocketEventEmissionData<T extends SocketEvents> = ({
  nomination : string
  updatedPlayerList : Record<number, Player>
  winnerAndNewComparison : GameRound
  answer : boolean
})[T]

interface MySocket {
  on  <T extends SocketEvents>(event : T, fn : (x : SocketEventEmissionData<T>) => void) : SocketIOClient.Emitter
  once<T extends SocketEvents>(event : T, fn : (x : SocketEventEmissionData<T>) => void) : SocketIOClient.Emitter
  emit<T extends SocketEvents>(event : T, data    : SocketEventEmissionData<T>)          : SocketIOClient.Emitter
}