import mongoose from 'mongoose'

const ChatGroupSchema = mongoose.Schema({
  name: String,
  usersAmount: { type: Number, default: 3 },
  messagesAnount: { type: Number, default: 0 },
  userId: String,
  members: [{ userId: String }],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null },
})

ChatGroupSchema.statics = {
  /**
   * create a new group
   * @param {object} item
   */
  createNew(item) {
    return this.create(item)
  },

  /**
   * Get chat group by userId and limit
   * @param {string} userId current userId
   * @param {number} limit
   */
  getChatGroups(userId, limit) {
    return this.find({
      members: { $elemMatch: { userId } },
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec()
  },
  /**
   * Get chat group
   * @param {string} id
   * @returns
   */
  getChatGroupById(id) {
    return this.findById(id).exec()
  },

  /**
   * Update group chat when has new message
   * @param {string} id
   * @param {number} newMessageAmount
   */
  updateWhenHasNewMessage(id, newMessageAmount) {
    return this.findByIdAndUpdate(id, {
      $set: {
        messagesAnount: newMessageAmount,
        updatedAt: Date.now(),
      },
    }).exec()
  },

  getChatGroupByIds(userId) {
    return this.find({
      members: { $elemMatch: { userId } },
    })
      .select('_id')
      .exec()
  },

  readMoreChatGroup(userId, skip, limit){
    return this.find({
          members: { $elemMatch: { userId } },
        })
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec()
  }
}

export default mongoose.model('chat_group', ChatGroupSchema)
