import socketio from 'socket.io-client';

export default ({ Vue }) => {
  Vue.prototype.$socketIo = socketio;
};
