import ContactSocket from './ContactSocket'
import ChatSocket from './ChatSocket'

/**
 * @param io from socket.io library
 */
const initSocket = io => {
  ContactSocket.addNew(io)
  ContactSocket.removeRequestContactSent(io)
  ContactSocket.removeContact(io)
  ContactSocket.removeRequestContactReceived(io)
  ContactSocket.approveRequestContactReceived(io)

  ChatSocket.textEmoji(io)
  ChatSocket.typingOn(io)
  ChatSocket.typingOff(io)
}

export default initSocket
