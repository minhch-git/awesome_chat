import mongoose from 'mongoose';

const ContactSchema = mongoose.Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null },
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  /**
   * Find all items that related with user
   * @param {currentUserId} userId
   */
  findAllByUser(userId) {
    return this.find({
      $and: [
        { status: true },
        {
          $or: [{ userId: userId }, { contactId: userId }],
        },
      ],
    }).exec();
  },

  /**
   * check exists of 2 users
   * @param {string} userId
   * @param {string} contactId
   */
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        {
          $and: [{ userId: userId }, { contactId: contactId }],
        },
        {
          $and: [{ userId: contactId }, { contactId: userId }],
        },
      ],
    }).exec();
  },

  /**
   * Remove request contact
   * @param {string} userId
   * @param {string} contactId
   */
  removeRequestContactSent(userId, contactId) {
    return this.deleteOne({
      $and: [{ userId }, { contactId }],
    }).exec();
  },

  /**
   * Remove request contact received
   * @param {string} userId
   * @param {string} contactId
   */
  removeRequestContactReceived(userId, contactId) {
    return this.deleteOne({
      $and: [{ userId: contactId }, { contactId: userId }],
    }).exec();
  },

  /**
   * Get contacts by userId and limit
   * @param {string} userId
   * @param {number} limit
   */
  getContacts(userId, limit) {
    return this.find({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * Get contacts sent by userId and limit
   * @param {string} userId
   * @param {number} limit
   */
  getContactsSent(userId, limit) {
    return this.find({
      $and: [{ userId: userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * Get contacts received by userId and limit
   * @param {string} userId
   * @param {number} limit
   */
  getContactsReceived(userId, limit) {
    return this.find({
      $and: [{ contactId: userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * Count all contacts
   * @param {string} userId
   */
  countAllContacts(userId) {
    return this.countDocuments({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    }).exec();
  },

  /**
   * Count all contacts
   * @param {string} userId
   */
  countAllContactsSent(userId) {
    return this.countDocuments({
      $and: [{ userId: userId }, { status: false }],
    }).exec();
  },

  /**
   * Count all contacts
   * @param {string} userId
   */
  countAllContactsReceived(userId) {
    return this.countDocuments({
      $and: [{ contactId: userId }, { status: false }],
    }).exec();
  },
  /**
   * Get contacts by userId and skip and limit
   * @param {string} userId
   * @param {number} skip
   * @param {number} limit
   * @returns promise
   */
  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  /**
   * Get contacts sent by userId and skip and limit
   * @param {string} userId
   * @param {number} skip
   * @param {number} limit
   * @returns promise
   */
  readMoreContactsSent(userId, skip, limit) {
    return this.find({
      $and: [{ userId: userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  /**
   * Get contacts received by userId and skip and limit
   * @param {string} userId
   * @param {number} skip
   * @param {number} limit
   * @returns promise
   */
  readMoreContactsReceived(userId, skip, limit) {
    return this.find({
      $and: [{ contactId: userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
};

export default mongoose.model('contact', ContactSchema);
