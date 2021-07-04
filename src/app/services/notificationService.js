import Notification from './../models/Notification'
import User from './../models/User'

class NotificationService {
  constructor() {
    this.LIMIT_NUMBER_TAKEN = 2
  }
  /**
   * Count all notifications unread
   * @param {string} currentUserId 
   * @returns promise
   */
  countNotifUnread(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        let notificationsUnread = await Notification.model.countNotifUnread(currentUserId)
        resolve(notificationsUnread)
      } catch (error) {
        console.error(error)
      }
    })
  }

  /**
   * Get notifications when f5 page
   * Just 10 item one time
   * @param {string} currentUserId 
   */
  getNotifications(currentUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        let notifications = await Notification.model.getByUserIdAndLimit(currentUserId, this.LIMIT_NUMBER_TAKEN)

        let getNotifContent = notifications.map(async (notification) => {
          let sender = await User.getNormalUserById(notification.senderId)
          return Notification.content.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar)
        })

        resolve(await Promise.all(getNotifContent))
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Read more notifications, max = 10
   * @param {string} currentUserId 
   * @param {number} skipNumberNotif
   */
  readMore(currentUserId, skipNumberNotif) {
    return new Promise(async (resolve, reject) => {
      try {
        const newNotifications = await Notification.model.readMore(currentUserId, skipNumberNotif, this.LIMIT_NUMBER_TAKEN)

        let getNotifContent = newNotifications.map(async (notification) => {
          let sender = await User.getNormalUserById(notification.senderId)
          return Notification.content.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar)
        })
        resolve(await Promise.all(getNotifContent))
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Mark notifications as read
   * @param {string} currentUserId 
   * @param {array} targetUsers 
   * @returns 
   */
  markAllAsRead(currentUserId, targetUsers) {
    return new Promise(async (resolve, reject) => {
      try {
        await Notification.model.markAllAsRead(currentUserId, targetUsers)
        resolve({ "success": true })
      } catch (error) {
        console.log('Error when mark notification as read: ', error)
        reject(false)
      }
    })
  }

}

export default new NotificationService();
