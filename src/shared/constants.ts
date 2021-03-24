






// export const enum SocketEvents {
//     nomination = "nomination",
//     updatedPlayerList = "updatedPlayerList",
//     winnerAndNewComparison = "winnerAndNewComparison",
//     answer = "answer"
// }

export const SocketEvents : { readonly [key in SocketEvents] : key } = {
    nomination: "nomination",
    updatedPlayerList: "updatedPlayerList",
    winnerAndNewComparison: "winnerAndNewComparison",
    answer: "answer"
}