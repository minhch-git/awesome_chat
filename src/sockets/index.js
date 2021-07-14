import ContactSocket from './ContactSocket';

/**
 * @param io from socket.io library
 */
const initSocket = io => {
  ContactSocket.addNew(io);
  ContactSocket.removeRequestContactSent(io);
  ContactSocket.removeContact(io);
  ContactSocket.removeRequestContactReceived(io);
  ContactSocket.approveRequestContactReceived(io);
  //
};

export default initSocket;
