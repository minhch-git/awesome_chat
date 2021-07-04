import ContactSocket from './ContactSocket';

/**
 * @param io from socket.io library
 */
const initSocket = io => {
  ContactSocket.addNew(io);
  ContactSocket.removeRequestContactSent(io);
  ContactSocket.removeRequestContactReceived(io);
  //
};

export default initSocket;
