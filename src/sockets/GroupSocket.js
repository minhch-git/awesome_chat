import socketHelper from '../helpers/socketHelper'
class Group {
  newGroupChat(io) {
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

      socket.on('new-group-created', groupChat => {
        clients = socketHelper.pushSocketIdToArray(
          clients,
          groupChat._id,
          socket.id
        )

        let response = { groupChat }

        groupChat.members.forEach(member => {
          if (
            clients[member.userId] &&
            member.userId != socket.request.user._id
          ) {
            socketHelper.emitNotifyToArray(
              clients,
              member.userId,
              io,
              'response-new-group-created',
              response
            )
          }
        })
      })

      socket.on('member-received-group-chat', data => {
        clients = socketHelper.pushSocketIdToArray(
          clients,
          data.groupChatId,
          socket.id
        )
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
export default new Group()
