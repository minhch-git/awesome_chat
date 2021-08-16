import socketHelper from '../helpers/socketHelper'
/**
 * @param io from socket.io library
 */
class ContactSocket {
  addNew(io) {
    let clients = {}
    io.on('connection', (socket) => {
      clients = socketHelper.pushSocketIdToArray(
        clients,
        socket.request.user._id,
        socket.id
      )

      socket.on('add-new-contact', (data) => {
        let currentUser = {
          id: socket.request.user._id,
          username: socket.request.user.username,
          avatar: socket.request.user.avatar,
          address:
            socket.request.user.address !== null
              ? socket.request.user.address
              : '',
        }
        if (clients[data.contactId]) {
          socketHelper.emitNotifyToArray(
            clients,
            data.contactId,
            io,
            'response-add-new-contact',
            currentUser
          )
        }
      })
      socket.on('disconnect', () => {
        clients = socketHelper.removeSocketIdFromArray(
          clients,
          socket.request.user._id,
          socket
        )
      })
    })
  }
  removeRequestContactSent(io) {
    let clients = {}
    io.on('connection', (socket) => {
      let currentUserId = socket.request.user._id
      clients = socketHelper.pushSocketIdToArray(
        clients,
        socket.request.user._id,
        socket.id
      )

      socket.on('remove-request-contact-sent', (data) => {
        if (clients[data.contactId]) {
          let currentUser = {
            id: currentUserId,
          }
          socketHelper.emitNotifyToArray(
            clients,
            data.contactId,
            io,
            'response-remove-request-contact-sent',
            currentUser
          )
        }
      })
      socket.on('disconnect', () => {
        clients = socketHelper.removeSocketIdFromArray(
          clients,
          socket.request.user._id,
          socket
        )
      })
    })
  }

  removeRequestContactReceived(io) {
    let clients = {}
    io.on('connection', (socket) => {
      let currentUserId = socket.request.user._id
      clients = socketHelper.pushSocketIdToArray(
        clients,
        socket.request.user._id,
        socket.id
      )

      socket.on('remove-request-contact-received', (data) => {
        if (clients[data.contactId]) {
          let currentUser = {
            id: currentUserId,
          }
          socketHelper.emitNotifyToArray(
            clients,
            data.contactId,
            io,
            'response-remove-request-contact-received',
            currentUser
          )
        }
      })
      socket.on('disconnect', () => {
        clients = socketHelper.removeSocketIdFromArray(
          clients,
          socket.request.user._id,
          socket
        )
      })
    })
  }
  removeContact(io) {
    let clients = {}
    io.on('connection', (socket) => {
      let currentUserId = socket.request.user._id
      clients = socketHelper.pushSocketIdToArray(
        clients,
        socket.request.user._id,
        socket.id
      )

      socket.on('remove-contact', (data) => {
        if (clients[data.contactId]) {
          let currentUser = {
            id: currentUserId,
          }
          socketHelper.emitNotifyToArray(
            clients,
            data.contactId,
            io,
            'response-remove-contact',
            currentUser
          )
        }
      })
      socket.on('disconnect', () => {
        clients = socketHelper.removeSocketIdFromArray(
          clients,
          socket.request.user._id,
          socket
        )
      })
    })
  }

  approveRequestContactReceived(io) {
    let clients = {}
    io.on('connection', (socket) => {
      clients = socketHelper.pushSocketIdToArray(
        clients,
        socket.request.user._id,
        socket.id
      )

      socket.on('approve-request-contact-received', (data) => {
        let currentUser = {
          id: socket.request.user._id,
          username: socket.request.user.username,
          avatar: socket.request.user.avatar,
          address:
            socket.request.user.address !== null
              ? socket.request.user.address
              : '',
        }
        if (clients[data.contactId]) {
          socketHelper.emitNotifyToArray(
            clients,
            data.contactId,
            io,
            'response-approve-request-contact-received',
            currentUser
          )
        }
      })
      socket.on('disconnect', () => {
        clients = socketHelper.removeSocketIdFromArray(
          clients,
          socket.request.user._id,
          socket
        )
      })
    })
  }
}

export default new ContactSocket()
