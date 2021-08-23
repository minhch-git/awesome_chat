import ContactSocket from './ContactSocket'
import ChatSocket from './ChatSocket'
import StatusSocket from './StatusSocket'
import GroupSocket from './GroupSocket'
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
  ChatSocket.chatImage(io)
  ChatSocket.chatAttachment(io)
  ChatSocket.chatVideo(io)
  ChatSocket.typingOn(io)
  ChatSocket.typingOff(io)

  StatusSocket.userOnlineOffline(io)
  GroupSocket.newGroupChat(io)
}

export default initSocket
