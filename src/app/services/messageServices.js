import Contact from '../models/Contact';
import Message from '../models/Message';

import User from '../models/User';
import ChatGroup from '../models/ChatGroup';
import _ from 'lodash';
const LIMIT_CONVERSATIONS_TAKEN = 30;
const LIMIT_MESSAGES_TAKEN = 30;
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
        let userConversationsPromise = contacts.map(
          async contact => {
            if (contact.contactId == currentUserId) {
              let getUserContact = await User.getNormalUserById(
                contact.userId
              );
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
        );

        // get user conversation
        let userConversations = await Promise.all(
          userConversationsPromise
        );
        // get group conversation
        let groupConversations = await ChatGroup.getChatGroups(
          currentUserId,
          LIMIT_CONVERSATIONS_TAKEN
        );

        let allConversations = _.sortBy(
          userConversations.concat(groupConversations),
          [item => -item.createAt]
        );

        // get message to apply in screen chat
        let allConversationsWithMessagePromise =
          allConversations.map(async converstation => {
            let getMessages = await Message.getMessages(
              currentUserId,
              converstation._id,
              LIMIT_MESSAGES_TAKEN
            );
            converstation = converstation.toObject();
            converstation.messages = getMessages;
            return converstation;
          });

        let allConversationsWithMessage = await Promise.all(
          allConversationsWithMessagePromise
        );
        // sort by updateAt desending
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
}
export default new MessageServices();
