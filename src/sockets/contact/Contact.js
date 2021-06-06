/**
 * @param io from socket.io library
 */

class Contact {
  async addNew(io) {
    io.on('connection', (socket) => {
      socket.on('add-new-contact', (data) => {
        console.log(data)
        console.log(socket.request.user)
      })
    })
  }
}

export default new Contact();
