import Contact from './../models/Contact'
import User from './../models/User'
import _ from 'lodash'

class ContactService {
  findUsersContact(currentUserId, keyword) {
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

  addNew(currentUserId, contactId) {
    return new Promise(async (resolve, reject) => {
      let contactExists = await Contact.checkExists(currentUserId, contactId)
      if (contactExists) {
        return reject(false)
      }

      let newContactItem = {
        userId: currentUserId,
        contactId: contactId
      }
      let newContact = await Contact.createNew(newContactItem)
      resolve(newContact)
    })
  }

  removeRequestContact(currentUserId, contactId) {
    return new Promise(async(resolve, reject) => {
      let removeReq = await Contact.removeRequestContact(currentUserId, contactId)
      if(removeReq.n === 0) {
        return reject(false)
      }
      return resolve(true)
    })
  }
}

export default new ContactService();
