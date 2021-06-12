import mongoose from 'mongoose'

const ContactSchema = mongoose.Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false, },
  createAt: { type: Number, default: Date.now, },
  updateAt: { type: Number, default: null, },
  deleteAt: { type: Number, default: null, }
})

ContactSchema.statics = {
  createNew(item) {
    return this.create(item)
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
          $or: [
            { 'userId': userId },
            { 'contactId': userId },
          ]
        }
      ]
    }).exec()
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
          $and: [
            { 'userId': userId },
            { 'contactId': contactId },
          ]
        },
        {
          $and: [
            { 'userId': contactId },
            { 'contactId': userId },
          ]
        }
      ]
    }).exec()
  },

  /**
   * Remove request contact
   * @param {string} userId 
   * @param {string} contactId 
   */

  removeRequestContact(userId, contactId) {
    return this.deleteOne({
      $and: [
        { userId },
        { contactId }
      ]
    }).exec()
  }


}

export default mongoose.model('contact', ContactSchema)
