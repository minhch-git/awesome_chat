import Contact from '../models/Contact';
import User from '../models/User';
import ChatGroup from '../models/ChatGroup';
import _ from 'lodash';
const LIMIT_CONVERSATIONS_TAKEN = 30;

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
        resolve({
          userConversations: _.sortBy(userConversations, [
            item => -item.createAt,
          ]),
          groupConversations,
          allConversations,
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
export default new MessageServices();
