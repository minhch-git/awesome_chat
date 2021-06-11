import mongoose from 'mongoose'

const NotificationSchema = mongoose.Schema({
  senderId: String,
  receiverId: String,
  type: String,
  createAt: { type: Number, default: Date.now, },
  isRead: { type: Boolean, default: false },
})

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item)
  },

  removeRequestContactNotification(senderId, receiverId, type) {
    return this.remove({
      $and: [
        { 'senderId': senderId },
        { 'receiverId': receiverId },
        { 'type': type }
      ]
    }).exec()
  },

  /**
   * Get userId and limit
   * @param {string} userId 
   * @param {number} limit 
   */
  getByUserIdAndLimit(userId, limit) {
    return this.find({ 'receiverId': userId }).sort({ "createAt": -1 }).limit(limit).exec()
  }
}

const NOTIFYCATION_TYPES = {
  ADD_CONTACT: 'add_contact'
}

const NOTIFYCATION_CONTENT = {
  getContent: (notificationTypes, isRead, userId, username, userAvatar) => {
    if (notificationTypes === NOTIFYCATION_TYPES.ADD_CONTACT) {
      return `
        <span data-uid="${userId}">
          <img class="avatar-small" src="images/users/${userAvatar}" alt="" />
          <strong>${username}</strong> Đã gửi cho bạn một lời mời kết bạn!<br /><br /><br />
        </span>`
    }
    return 'No matching with any notification type.'
  }
}

module.exports = {
  model: mongoose.model('notification', NotificationSchema),
  types: NOTIFYCATION_TYPES,
  content: NOTIFYCATION_CONTENT,
}
