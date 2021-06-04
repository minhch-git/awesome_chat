import Contact from './../models/Contact'
import User from './../models/User'
import _ from 'lodash'

class ContactService {
  async findUsersContact(currentUserId, keyword) {
    return new Promise(async (resolve, reject) => {
      try {
        let deprecatedUserIds = [currentUserId]
        let contactsByUser = await Contact.findAllByUser(currentUserId)
        contactsByUser.forEach(contact => {
          deprecatedUserIds.push(contact.userId, contact.contactId)
        })
        deprecatedUserIds = _.uniqBy(deprecatedUserIds)
        let users = await User.findAllForAddContact(deprecatedUserIds, keyword)
        resolve(users)
      } catch (error) {
        console.log(error)
      }
    })
  }
}

export default new ContactService();
