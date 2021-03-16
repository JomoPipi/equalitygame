const socket = io();
export function subscribe(type, callback) {
    console.log('subscribed!');
    socket.on(type, callback);
}
export function subscribeOnce(type, callback) {
    console.log('subscribed once!');
    socket.once(type, callback);
}
export function emit(type, data) {
    socket.emit(type, data);
}
//# sourceMappingURL=helpers.js.map