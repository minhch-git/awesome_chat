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
      $or: [
        { 'userId': userId },
        {'contactId': userId}
      ]
    }).exec()
  }
}

export default mongoose.model('contact', ContactSchema)
