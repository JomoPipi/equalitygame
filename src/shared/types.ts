






interface Player {
  color : string
  id : number
  score : number
  name : string
  faceData : [number, number, number, number]
}

type SocketTypes
  = 'nomination'
  | 'updatedPlayerList'
  | 'newComparison'
  | 'answer'