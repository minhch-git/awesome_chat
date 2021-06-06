import Contact from './contact/Contact'

/**
 * @param io from socket.io library
 */

const initSocket = (io) => {
  Contact.addNew(io)
  Contact.removeRequest(io)
  // 
}

export default initSocket