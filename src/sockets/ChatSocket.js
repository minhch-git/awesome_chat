import { response } from 'express'
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
  chatImage(io) {
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

      socket.on('chat-image', data => {
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
              'response-chat-image',
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
              'response-chat-image',
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
  chatAttachment(io) {
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

      socket.on('chat-attachment', data => {
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
              'response-chat-attachment',
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
              'response-chat-attachment',
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

  chatVideo(io) {
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
      // Step 01: of caller
      socket.on('caller-check-listener-online-or-not', data => {
        if (clients[data.listenerId]) {
          // online
          const response = {
            listenerId: data.listenerId,
            callerId: socket.request.user._id,
            callerName: data.callerName,
          }
          // Step 03: of listener
          socketHelper.emitNotifyToArray(
            clients,
            data.listenerId,
            io,
            'server-request-peer-id-of-listener',
            response
          )
        } else {
          // Step 02: of caller
          socket.emit('server-send-listener-is-offline')
        }
      })
      // Step 04: of listener
      socket.on('listener-emit-peer-id-to-server', data => {
        let response = {
          listenerId: data.listenerId,
          callerId: data.callerId,
          callerName: data.callerName,
          listenerPeerId: data.listenerPeerId,
          listenerName: data.listenerName,
        }
        // Step 05: of caller
        if (clients[data.callerId]) {
          socketHelper.emitNotifyToArray(
            clients,
            data.callerId,
            io,
            'server-send-peer-id-of-listener-to-caller',
            response
          )
        }
      })
      // Step 06: of caller
      socket.on('caller-request-call-to-server', data => {
        let response = {
          listenerId: data.listenerId,
          callerId: data.callerId,
          callerName: data.callerName,
          listenerPeerId: data.listenerPeerId,
          listenerName: data.listenerName,
        }
        // Step 08: of listener
        if (clients[data.listenerId]) {
          socketHelper.emitNotifyToArray(
            clients,
            data.listenerId,
            io,
            'server-send-request-call-to-listener',
            response
          )
        }
      })
      // Step 07: of caller
      socket.on('caller-cancel-request-call-to-server', data => {
        let response = {
          listenerId: data.listenerId,
          callerId: data.callerId,
          callerName: data.callerName,
          listenerPeerId: data.listenerPeerId,
          listenerName: data.listenerName,
        }
        // Step 09: of listener
        if (clients[data.listenerId]) {
          socketHelper.emitNotifyToArray(
            clients,
            data.listenerId,
            io,
            'server-send-cancel-request-call-to-listener',
            response
          )
        }
      })

      // Step 10: of listener
      socket.on('listener-reject-request-call-to-server', data => {
        let response = {
          listenerId: data.listenerId,
          callerId: data.callerId,
          callerName: data.callerName,
          listenerPeerId: data.listenerPeerId,
          listenerName: data.listenerName,
        }
        // Step 12: of caller
        if (clients[data.callerId]) {
          socketHelper.emitNotifyToArray(
            clients,
            data.callerId,
            io,
            'server-send-reject-call-to-caller',
            response
          )
        }
      })

      // Step 11: of listener
      socket.on('listener-accept-request-call-to-server', data => {
        let response = {
          listenerId: data.listenerId,
          callerId: data.callerId,
          callerName: data.callerName,
          listenerPeerId: data.listenerPeerId,
          listenerName: data.listenerName,
        }
        if (clients[data.callerId]) {
          socketHelper.emitNotifyToArray(
            clients,
            data.callerId,
            io,
            'server-send-accept-call-to-caller',
            response
          )
        }
        if (clients[data.listenerId]) {
          socketHelper.emitNotifyToArray(
            clients,
            data.listenerId,
            io,
            'server-send-accept-call-to-listener',
            response
          )
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
  typingOn(io) {
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

      socket.on('user-is-typing', data => {
        if (data.groupId) {
          let response = {
            currentUserId: socket.request.user._id,
            currentGroupId: data.groupId,
          }
          if (clients[data.groupId]) {
            socketHelper.emitNotifyToArray(
              clients,
              data.groupId,
              io,
              'response-user-is-typing',
              response
            )
          }
        }

        if (data.contactId) {
          let response = {
            currentUserId: socket.request.user._id,
          }
          if (clients[data.contactId]) {
            socketHelper.emitNotifyToArray(
              clients,
              data.contactId,
              io,
              'response-user-is-typing',
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
  typingOff(io) {
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

      socket.on('user-is-not-typing', data => {
        if (data.groupId) {
          let response = {
            currentUserId: socket.request.user._id,
            currentGroupId: data.groupId,
          }
          if (clients[data.groupId]) {
            socketHelper.emitNotifyToArray(
              clients,
              data.groupId,
              io,
              'response-user-is-not-typing',
              response
            )
          }
        }

        if (data.contactId) {
          let response = {
            currentUserId: socket.request.user._id,
          }
          if (clients[data.contactId]) {
            socketHelper.emitNotifyToArray(
              clients,
              data.contactId,
              io,
              'response-user-is-not-typing',
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
