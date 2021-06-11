import Notification from './../models/Notification'
import User from './../models/User'
class NotificationService {

  /**
   * Get notifications when f5 page
   * Just 10 item one time
   * @param {string} currentUserId 
   * @param {number} limit 
   */
  getNotifications(currentUserId, limit = 10) {
    return new Promise(async (resolve, reject) => {
      try {
        let notifications = await Notification.model.getByUserIdAndLimit(currentUserId, limit)

        let getNotifContent = notifications.map(async (notification) => {
          let sender = await User.findByUserId(notification.senderId)
          return Notification.content.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar)
        })

        resolve(await Promise.all(getNotifContent))
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default new NotificationService();
