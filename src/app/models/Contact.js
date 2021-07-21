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
      $or: [{ userId: userId }, { contactId: userId }],
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
   * Remove contact
   * @param {string} userId
   * @param {string} contactId
   */
  removeContact(userId, contactId) {
    return this.remove({
      $or: [
        {
          $and: [
            { userId: userId },
            { contactId: contactId },
            { status: true },
          ],
        },
        {
          $and: [
            { userId: contactId },
            { contactId: userId },
            { status: true },
          ],
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
      $and: [{ userId }, { contactId }, { status: false }],
    }).exec();
  },

  /**
   * Remove request contact received
   * @param {string} userId
   * @param {string} contactId
   */
  removeRequestContactReceived(userId, contactId) {
    return this.deleteOne({
      $and: [
        { userId: contactId },
        { contactId: userId },
        { status: false },
      ],
    }).exec();
  },
  /**
   * approve contact
   * @param {string: of currentUser} userId
   * @param {string} contactId
   */
  approveRequestContactReceived(userId, contactId) {
    return this.updateOne(
      {
        $and: [
          { userId: contactId },
          { contactId: userId },
          { status: false },
        ],
      },
      { status: true },
      { updateAt: Date.now() }
    ).exec();
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
      .sort({ updateAt: -1 })
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
      .sort({ updateAt: -1 })
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
