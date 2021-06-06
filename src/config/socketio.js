import passportSocketIo from 'passport.socketio'

const configSocketIo = (io, cookieParser, sessionStore) => {
  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    success: (data, accept) => {
      return accept(null, true)
    },
    fail: (data, message, error, accept) => {
      if (error) {
        console.log('failed connection to socket.io:', message)
        return accept(new Error(message), false)
      }
    },
  }));
}
export default configSocketIo