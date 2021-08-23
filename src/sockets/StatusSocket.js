import socketHelper from '../helpers/socketHelper'
/**
 * @param io from socket.io library
 */
class StatusSocket {
  userOnlineOffline(io) {
    let clients = {}
    io.on('connection', socket => {
      clients = socketHelper.pushSocketIdToArray(
        clients,
        socket.request.user._id,
        socket.id
      )

      socket.request.user.groupByIds.forEach(group => {
        clients = socketHelper.pushSocketIdToArray(
          clients,
          group._id,
          socket.id
        )
      })
      let listUsersOnline = Object.keys(clients)
      // Step 01: Emit to user after login of f5 web page
      socket.emit('server-send-list-user-online', listUsersOnline)

      // Step 02: Emit to all anothor users when has new user online
      socket.broadcast.emit(
        'server-send-when-new-user-online',
        socket.request.user._id
      )

      socket.on('disconnect', () => {
        clients = socketHelper.removeSocketIdFromArray(
          clients,
          socket.request.user._id,
          socket
        )
        socket.request.user.groupByIds.forEach(group => {
          clients = socketHelper.removeSocketIdFromArray(
            clients,
            group._id,
            socket.id
          )
        })

        // Step 03: Emit to all anothor users when has new user offline
        socket.broadcast.emit(
          'server-send-when-new-user-offline',
          socket.request.user._id
        )
      })
    })
  }
}

export default new StatusSocket()
