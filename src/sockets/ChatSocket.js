import socketHelper from '../helpers/socketHelper'
class Chat {
  /**
   * @param io from socket.io library
   */
  textEmoji(io) {
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

      socket.on('chat-text-emoji', data => {
        if (data.groupId) {
          let response = {
            currentUserId: socket.request.user._id,
            currentGroupId: data.groupId,
            message: data.message,
          }
          if (clients[data.groupId]) {
            socketHelper.emitNotifyToArray(
              clients,
              data.groupId,
              io,
              'response-chat-text-emoji',
              response
            )
          }
        }

        if (data.contactId) {
          let response = {
            currentUserId: socket.request.user._id,
            message: data.message,
          }
          if (clients[data.contactId]) {
            socketHelper.emitNotifyToArray(
              clients,
              data.contactId,
              io,
              'response-chat-text-emoji',
              response
            )
          }
        }
      })
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
      })
    })
  }
}
export default new Chat()
