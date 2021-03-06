import mongoose from "mongoose";

const NotificationSchema = mongoose.Schema({
  senderId: String,
  receiverId: String,
  type: String,
  createdAt: { type: Number, default: Date.now },
  isRead: { type: Boolean, default: false },
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  removeRequestContactSentNotification(senderId, receiverId, type) {
    return this.deleteOne({
      $and: [
        { senderId: senderId },
        { receiverId: receiverId },
        { type: type },
      ],
    }).exec();
  },

  /**
   * Get userId and limit
   * @param {string} userId
   * @param {number} limit
   */
  getByUserIdAndLimit(userId, limit) {
    return this.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  countNotifUnread(userId) {
    return this.countDocuments({
      $and: [{ receiverId: userId }, { isRead: false }],
    }).exec();
  },

  /**
   * Readmore notifications
   * @param {string} userId
   * @param {number} skip
   * @param {number} limit
   */
  readMore(userId, skip, limit) {
    return this.find({ receiverId: userId })
      .skip(skip)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * Mark notification as read
   * @param {string} userId
   * @param {array} targetUsers
   */
  markAllAsRead(userId, targetUsers) {
    return this.updateMany(
      {
        $and: [{ receiverId: userId }, { senderId: { $in: targetUsers } }],
      },
      { isRead: true }
    ).exec();
  },
};

const NOTIFYCATION_TYPES = {
  ADD_CONTACT: "add_contact",
  APPROVE_CONTACT: "approve_contact",
};

const NOTIFYCATION_CONTENT = {
  getContent: (notificationTypes, isRead, userId, username, userAvatar) => {
    if (notificationTypes === NOTIFYCATION_TYPES.APPROVE_CONTACT) {
      if (!isRead) {
        return `
        <span class="d-block notif-readed-false" data-uid="${userId}">
          <img class="avatar-small" src="images/users/${userAvatar}" alt="" />
          <strong>${username}</strong> d?? ch???p nh???n l???i m???i k???t b???n!
        </span>`;
      }
      return `
        <span class="d-block" data-uid="${userId}">
          <img class="avatar-small" src="images/users/${userAvatar}" alt="" />
          <strong>${username}</strong> d?? ch???p nh???n l???i m???i k???t b???n!
        </span>`;
    }
    if (notificationTypes === NOTIFYCATION_TYPES.ADD_CONTACT) {
      if (!isRead) {
        return `
        <span class="d-block notif-readed-false" data-uid="${userId}">
          <img class="avatar-small" src="images/users/${userAvatar}" alt="" />
          <strong>${username}</strong> ???? g???i cho b???n m???t l???i m???i k???t b???n!
        </span>`;
      }
      return `
        <span class="d-block" data-uid="${userId}">
          <img class="avatar-small" src="images/users/${userAvatar}" alt="" />
          <strong>${username}</strong> ???? g???i cho b???n m???t l???i m???i k???t b???n!
        </span>`;
    }
    return "No matching with any notification type.";
  },
};

module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFYCATION_TYPES,
  content: NOTIFYCATION_CONTENT,
};
