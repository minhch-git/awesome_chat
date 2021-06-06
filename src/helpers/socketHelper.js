class SocketHelper {
  pushSocketIdToArray(clients, userId, socketId) {
    if (Array.isArray(clients[userId])) {
      clients[userId].push(socketId)
    } else {
      clients[userId] = [socketId]
    }
    return clients
  }

  emitNotifyToArray(clients, userId, io, eventName, data) {
    clients[userId].forEach(socketId => io.to(`${socketId}`).emit(eventName, data))
  }

  removeSocketIdFromArray(clients, userId, socket) {
    clients[userId] = clients[userId].filter(socketId => socketId !== socket.id)
    if (!clients[userId].length) {
      delete clients[userId]
    }

    return clients
  }
}

export default new SocketHelper();
