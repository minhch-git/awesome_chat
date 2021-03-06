import _ from "lodash";
import Contact from "../models/Contact";
import Message, {
  MESSAGE_CONVERSATION_TYPES as messageConverSationType,
  MESSAGE_TYPES as messageType,
} from "../models/Message";
import User from "../models/User";
import ChatGroup from "../models/ChatGroup";
import { transErrors } from "../../../lang/vi";
import { appConfig } from "../../config";
import fsExtra from "fs-extra";

const LIMIT_CONVERSATIONS_TAKEN = 6;
const LIMIT_MESSAGES_TAKEN = 10;
class MessageServices {
  /**
   * Get all conversations
   * @param { string } currentUserId
   */
  getAllConversationItems(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        let contacts = await Contact.getContacts(
          currentUserId,
          LIMIT_CONVERSATIONS_TAKEN
        );


        var contactCall = async contact => {
          if (contact.contactId == currentUserId) {
            let getUserContact = await User.getNormalUserById(contact.userId);
            getUserContact.updatedAt = contact.updatedAt;
            return getUserContact;
          } else {
            let getUserContact = await User.getNormalUserById(
              contact.contactId
            );
            getUserContact.updatedAt = contact.updatedAt;
            return getUserContact;
          }
        }
        let userConversationsPromise = contacts.map(contactCall);

        
        // get user conversation
        let userConversations = await Promise.all(userConversationsPromise);
        // get group conversation
        let groupConversations = await ChatGroup.getChatGroups(
          currentUserId,
          LIMIT_CONVERSATIONS_TAKEN
        );

        let allConversations = _.sortBy(
          userConversations.concat(groupConversations),
          [item => -item.createdAt]
        );
        // get message to apply in screen chat
        let allConversationsWithMessagePromise = allConversations.map(
          async converstation => {
            converstation.membersInfo = [];
            if (converstation.members) {
              for (const member of converstation.members) {
                let userInfo = await User.getNormalUserById(member.userId);
                converstation.membersInfo.push(userInfo);
              }

              let getMessages = await Message.getMessagesInGroup(
                converstation._id,
                LIMIT_MESSAGES_TAKEN
              );
              converstation.messages = _.reverse(getMessages);
            } else {
              let getMessages = await Message.getMessagesInPersonal(
                currentUserId,
                converstation._id,
                LIMIT_MESSAGES_TAKEN
              );
              converstation.messages = _.reverse(getMessages);
            }
            return converstation;
          }
        );

        let allConversationsWithMessage = await Promise.all(
          allConversationsWithMessagePromise
        );

        // sort by updatedAt desending
        allConversationsWithMessage = _.sortBy(
          allConversationsWithMessage,
          item => -item.updatedAt
        );

        resolve({
          userConversations,
          groupConversations,
          allConversations,
          allConversationsWithMessage,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * add new message text and emoji
   * @param {object} sender // current user
   * @param {string} receivedId // a user or a group
   * @param {string} messageVal
   * @param {boolean} isChatGroup
   */
  addNewTextEmoji(sender, receivedId, messageVal, isChatGroup) {
    return new Promise(async (resolve, reject) => {
      try {
        let getChatGroupReceiver;
        if (isChatGroup) {
          getChatGroupReceiver = await ChatGroup.getChatGroupById(receivedId);

          if (!getChatGroupReceiver) {
            return reject(transErrors.conversation_not_found);
          }

          let receiver = {
            id: getChatGroupReceiver._id,
            name: getChatGroupReceiver.name,
            avatar: appConfig.general_avatar_group_chat,
          };

          let newMessageItem = {
            senderId: sender.id,
            receiverId: receiver.id,
            conversationType: messageConverSationType.GROUP,
            messageType: messageType.TEXT,
            sender: sender,
            receiver: receiver,
            text: messageVal,
            createdAt: Date.now(),
          };

          // create new Message
          let newMessage = await Message.createNew(newMessageItem);
          // update group chat
          await ChatGroup.updateWhenHasNewMessage(
            receiver.id,
            getChatGroupReceiver.messagesAnount + 1
          );

          resolve(newMessage);
        } else {
          let getUserReceiver = await User.getNormalUserById(receivedId);
          if (!getUserReceiver) {
            return reject(transErrors.conversation_not_found);
          }
          let receiver = {
            id: getUserReceiver._id,
            name: getUserReceiver.username,
            avatar: getUserReceiver.avatar,
          };
          let newMessageItem = {
            senderId: sender.id,
            receiverId: receiver.id,
            conversationType: messageConverSationType.PERSONAL,
            messageType: messageType.TEXT,
            sender: sender,
            receiver: receiver,
            text: messageVal,
            createdAt: Date.now(),
          };
          // create new Message
          let newMessage = await Message.createNew(newMessageItem);
          // update contact
          await Contact.updateWhenHasNewMessage(sender.id, getUserReceiver._id);

          resolve(newMessage);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * add new message image
   * @param {object} sender // current user
   * @param {string} receivedId // a user or a group
   * @param {file} messageVal
   * @param {boolean} isChatGroup
   */
  addNewImage(sender, receivedId, messageVal, isChatGroup) {
    return new Promise(async (resolve, reject) => {
      try {
        let getChatGroupReceiver;
        if (isChatGroup) {
          getChatGroupReceiver = await ChatGroup.getChatGroupById(receivedId);

          if (!getChatGroupReceiver) {
            return reject(transErrors.conversation_not_found);
          }

          let receiver = {
            id: getChatGroupReceiver._id,
            name: getChatGroupReceiver.name,
            avatar: appConfig.general_avatar_group_chat,
          };

          let imageBuffer = await fsExtra.readFile(messageVal.path);
          let imageContentType = messageVal.mimetype;
          let imageName = messageVal.originalname;
          let newMessageItem = {
            senderId: sender.id,
            receiverId: receiver.id,
            conversationType: messageConverSationType.GROUP,
            messageType: messageType.IMAGE,
            sender: sender,
            receiver: receiver,
            file: {
              data: imageBuffer,
              contentType: imageContentType,
              fileName: imageName,
            },
            createdAt: Date.now(),
          };

          // create new Message
          let newMessage = await Message.createNew(newMessageItem);
          // update group chat
          await ChatGroup.updateWhenHasNewMessage(
            receiver.id,
            getChatGroupReceiver.messagesAnount + 1
          );

          resolve(newMessage);
        } else {
          let getUserReceiver = await User.getNormalUserById(receivedId);
          if (!getUserReceiver) {
            return reject(transErrors.conversation_not_found);
          }
          let receiver = {
            id: getUserReceiver._id,
            name: getUserReceiver.username,
            avatar: getUserReceiver.avatar,
          };
          let imageBuffer = await fsExtra.readFile(messageVal.path);
          let imageContentType = messageVal.mimetype;
          let imageName = messageVal.originalname;
          let newMessageItem = {
            senderId: sender.id,
            receiverId: receiver.id,
            conversationType: messageConverSationType.PERSONAL,
            messageType: messageType.IMAGE,
            sender: sender,
            receiver: receiver,
            file: {
              data: imageBuffer,
              contentType: imageContentType,
              fileName: imageName,
            },
            createdAt: Date.now(),
          };

          // create new Message
          let newMessage = await Message.createNew(newMessageItem);
          // update contact
          await Contact.updateWhenHasNewMessage(sender.id, getUserReceiver._id);

          resolve(newMessage);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * add new message attachment
   * @param {object} sender // current user
   * @param {string} receivedId // a user or a group
   * @param {file} messageVal
   * @param {boolean} isChatGroup
   */
  addNewAttachment(sender, receivedId, messageVal, isChatGroup) {
    return new Promise(async (resolve, reject) => {
      try {
        let getChatGroupReceiver;
        if (isChatGroup) {
          getChatGroupReceiver = await ChatGroup.getChatGroupById(receivedId);

          if (!getChatGroupReceiver) {
            return reject(transErrors.conversation_not_found);
          }

          let receiver = {
            id: getChatGroupReceiver._id,
            name: getChatGroupReceiver.name,
            avatar: appConfig.general_avatar_group_chat,
          };

          let attachmentBuffer = await fsExtra.readFile(messageVal.path);
          let attachmentContentType = messageVal.mimetype;
          let attachmentName = messageVal.originalname;

          let newMessageItem = {
            senderId: sender.id,
            receiverId: receiver.id,
            conversationType: messageConverSationType.GROUP,
            messageType: messageType.FILE,
            sender: sender,
            receiver: receiver,
            file: {
              data: attachmentBuffer,
              contentType: attachmentContentType,
              fileName: attachmentName,
            },
            createdAt: Date.now(),
          };

          // create new Message
          let newMessage = await Message.createNew(newMessageItem);
          // update group chat
          await ChatGroup.updateWhenHasNewMessage(
            receiver.id,
            getChatGroupReceiver.messagesAnount + 1
          );

          resolve(newMessage);
        } else {
          let getUserReceiver = await User.getNormalUserById(receivedId);
          if (!getUserReceiver) {
            return reject(transErrors.conversation_not_found);
          }
          let receiver = {
            id: getUserReceiver._id,
            name: getUserReceiver.username,
            avatar: getUserReceiver.avatar,
          };

          let attachmentBuffer = await fsExtra.readFile(messageVal.path);
          let attachmentContentType = messageVal.mimetype;
          let attachmentName = messageVal.originalname;

          let newMessageItem = {
            senderId: sender.id,
            receiverId: receiver.id,
            conversationType: messageConverSationType.PERSONAL,
            messageType: messageType.FILE,
            sender: sender,
            receiver: receiver,
            file: {
              data: attachmentBuffer,
              contentType: attachmentContentType,
              fileName: attachmentName,
            },
            createdAt: Date.now(),
          };

          // create new Message
          let newMessage = await Message.createNew(newMessageItem);
          // update contact
          await Contact.updateWhenHasNewMessage(sender.id, getUserReceiver._id);

          resolve(newMessage);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Read more message
   * @param {string} currentUserId
   * @param {number} skipMessage
   * @param {string} targetId
   * @param {boolean} isChatGroup
   */
  readMore(currentUserId, skipMessage, targetId, isChatGroup) {
    return new Promise(async (resolve, reject) => {
      try {
        // Message in group
        if (isChatGroup) {
          let getMessages = await Message.readMoreMessagesInGroup(
            targetId,
            skipMessage,
            LIMIT_MESSAGES_TAKEN
          );
          getMessages.messages = _.reverse(getMessages);
          return resolve(getMessages);
        }

        // Message in personal
        let getMessages = await Message.readMoreMessagesInPersonal(
          currentUserId,
          targetId,
          skipMessage,
          LIMIT_MESSAGES_TAKEN
        );
        getMessages.messages = _.reverse(getMessages);

        return resolve(getMessages);
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * Read more personal and group
   * @param {string} currentUserId
   * @param {number} skipGroup
   * @param {number} skipPersonal
   */
  readMoreAllChat(currentUserId, skipGroup, skipPersonal) {
    return new Promise(async (resolve, reject) => {
      try {
        let contacts = await Contact.readMoreContacts(
          currentUserId,
          skipPersonal,
          LIMIT_CONVERSATIONS_TAKEN
        );

        let userConversationsPromise = contacts.map(async contact => {
          if (contact.contactId == currentUserId) {
            let getUserContact = await User.getNormalUserById(contact.userId);
            getUserContact.updatedAt = contact.updatedAt;
            return getUserContact;
          } else {
            let getUserContact = await User.getNormalUserById(
              contact.contactId
            );
            getUserContact.updatedAt = contact.updatedAt;
            return getUserContact;
          }
        });

        // get user conversation
        let userConversations = await Promise.all(userConversationsPromise);
        // get group conversation
        let groupConversations = await ChatGroup.readMoreChatGroup(
          currentUserId,
          skipGroup,
          LIMIT_CONVERSATIONS_TAKEN
        );

        let allConversations = _.sortBy(
          userConversations.concat(groupConversations),
          [item => -item.createdAt]
        );

        // get message to apply in screen chat
        let allConversationsWithMessagePromise = allConversations.map(
          async converstation => {
            if (converstation.members) {
              let getMessages = await Message.getMessagesInGroup(
                converstation._id,
                LIMIT_MESSAGES_TAKEN
              );
              converstation.messages = _.reverse(getMessages);
            } else {
              let getMessages = await Message.getMessagesInPersonal(
                currentUserId,
                converstation._id,
                LIMIT_MESSAGES_TAKEN
              );
              converstation.messages = _.reverse(getMessages);
            }

            return converstation;
          }
        );

        let allConversationsWithMessage = await Promise.all(
          allConversationsWithMessagePromise
        );
        // sort by updatedAt desending
        allConversationsWithMessage = _.sortBy(
          allConversationsWithMessage,
          item => -item.updatedAt
        );
        resolve(allConversationsWithMessage);
      } catch (error) {
        reject(error);
      }
    });
  }
}
export default new MessageServices();
