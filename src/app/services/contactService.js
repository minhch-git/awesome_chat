import Contact from './../models/Contact'
import Notification from './../models/Notification'
import User from './../models/User'
import _ from 'lodash'
const LIMIT_NUMBER_TAKEN = 2
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

      // create contact
      let newContactItem = {
        userId: currentUserId,
        contactId: contactId,
      }
      let newContact = await Contact.createNew(newContactItem)

      // create notification
      let notificationItem = {
        senderId: currentUserId,
        receiverId: contactId,
        type: Notification.types.ADD_CONTACT,
      }
      await Notification.model.createNew(notificationItem)

      resolve(newContact)
    })
  }
  removeContact(currentUserId, contactId) {
    return new Promise(async (resolve, reject) => {
      let removeContact = await Contact.removeContact(currentUserId, contactId)
      if (removeContact.n === 0) {
        return reject(false)
      }
      return resolve(true)
    })
  }

  removeRequestContactSent(currentUserId, contactId) {
    return new Promise(async (resolve, reject) => {
      let removeReq = await Contact.removeRequestContactSent(
        currentUserId,
        contactId
      )
      if (removeReq.n === 0) {
        return reject(false)
      }

      // remove notification
      await Notification.model.removeRequestContactSentNotification(
        currentUserId,
        contactId,
        Notification.types.ADD_CONTACT
      )

      return resolve(true)
    })
  }

  removeRequestContactReceived(currentUserId, contactId) {
    return new Promise(async (resolve, reject) => {
      let removeReq = await Contact.removeRequestContactReceived(
        currentUserId,
        contactId
      )
      if (removeReq.n === 0) {
        return reject(false)
      }

      // remove notification Chức năng này chua muốn lam
      // await Notification.model.removeRequestContactReceivedNotification(
      //   currentUserId,
      //   contactId,
      //   Notification.types.ADD_CONTACT
      // );

      return resolve(true)
    })
  }

  approveRequestContactReceived(currentUserId, contactId) {
    return new Promise(async (resolve, reject) => {
      let approveReq = await Contact.approveRequestContactReceived(
        currentUserId,
        contactId
      )
      if (approveReq.nModified === 0) {
        return reject(false)
      }
      //create notification
      // create notification
      let notificationItem = {
        senderId: currentUserId,
        receiverId: contactId,
        type: Notification.types.APPROVE_CONTACT,
      }
      await Notification.model.createNew(notificationItem)
      return resolve(true)
    })
  }

  getContacts(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        let contacts = await Contact.getContacts(
          currentUserId,
          LIMIT_NUMBER_TAKEN
        )
        let users = contacts.map(async contact => {
          if (contact.contactId == currentUserId) {
            return await User.getNormalUserById(contact.userId)
          } else {
            return await User.getNormalUserById(contact.contactId)
          }
        })
        return resolve(await Promise.all(users))
      } catch (error) {
        reject(error)
      }
    })
  }

  getContactsSent(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        const contacts = await Contact.getContactsSent(
          currentUserId,
          LIMIT_NUMBER_TAKEN
        )
        const users = contacts.map(
          async contact => await User.getNormalUserById(contact.contactId)
        )
        resolve(await Promise.all(users))
      } catch (error) {
        reject(error)
      }
    })
  }

  getContactsReceived(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        const contacts = await Contact.getContactsReceived(
          currentUserId,
          LIMIT_NUMBER_TAKEN
        )
        const users = contacts.map(
          async contact => await User.getNormalUserById(contact.userId)
        )
        resolve(await Promise.all(users))
      } catch (error) {
        reject(error)
      }
    })
  }

  countAllContacts(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        const count = await Contact.countAllContacts(currentUserId)
        resolve(count)
      } catch (error) {
        reject(error)
      }
    })
  }
  countAllContactsSent(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        const count = await Contact.countAllContactsSent(currentUserId)
        resolve(count)
      } catch (error) {
        reject(error)
      }
    })
  }
  countAllContactsReceived(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        const count = await Contact.countAllContactsReceived(currentUserId)
        resolve(count)
      } catch (error) {
        reject(error)
      }
    })
  }

  readMoreContacts(currentUserId, skipNumberContacts) {
    return new Promise(async (resolve, reject) => {
      try {
        let newContacts = await Contact.readMoreContacts(
          currentUserId,
          skipNumberContacts,
          LIMIT_NUMBER_TAKEN
        )
        let users = newContacts.map(async contact => {
          if (contact.contactId == currentUserId) {
            return await User.getNormalUserById(contact.userId)
          } else {
            return await User.getNormalUserById(contact.contactId)
          }
        })
        return resolve(await Promise.all(users))
      } catch (error) {
        return reject(error)
      }
    })
  }
  readMoreContactsSent(currentUserId, skipNumberContacts) {
    return new Promise(async (resolve, reject) => {
      try {
        let newContacts = await Contact.readMoreContactsSent(
          currentUserId,
          skipNumberContacts,
          LIMIT_NUMBER_TAKEN
        )
        let users = newContacts.map(async contact => {
          if (contact.contactId == currentUserId) {
            return await User.getNormalUserById(contact.userId)
          } else {
            return await User.getNormalUserById(contact.contactId)
          }
        })
        return resolve(await Promise.all(users))
      } catch (error) {
        return reject(error)
      }
    })
  }
  readMoreContactsReceived(currentUserId, skipNumberContacts) {
    return new Promise(async (resolve, reject) => {
      try {
        let newContacts = await Contact.readMoreContactsReceived(
          currentUserId,
          skipNumberContacts,
          LIMIT_NUMBER_TAKEN
        )
        let users = newContacts.map(async contact => {
          if (contact.contactId == currentUserId) {
            return await User.getNormalUserById(contact.userId)
          } else {
            return await User.getNormalUserById(contact.contactId)
          }
        })
        return resolve(await Promise.all(users))
      } catch (error) {
        return reject(error)
      }
    })
  }

  searchFriends(currentUserId, keyword) {
    return new Promise(async (resolve, reject) => {
      try {
        let friendIds = []
        let friends = await Contact.getFriends(currentUserId)
        friends.forEach(item => {
          friendIds.push(item.userId)
          friendIds.push(item.contactId)
        })

        friendIds = _.uniqBy(friendIds)
        friendIds = friendIds.filter(userId => userId != currentUserId)
        
        let users = await User.findAllToAddGroupChat(friendIds, keyword)
        resolve(users)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }
}

export default new ContactService()
